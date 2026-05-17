import { Types } from "mongoose";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../errors/AppError.js";
import { Note, type INote, type NoteDocument } from "../models/Note.model.js";
import { NoteVersion } from "../models/NoteVersion.model.js";
import { User } from "../models/User.model.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";

interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
}

interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
}

interface ListNotesQuery {
  page?: unknown;
  limit?: unknown;
  search?: unknown;
  tag?: unknown;
  isFavorite?: unknown;
  isPinned?: unknown;
  includeDeleted?: unknown;
}

const normalizeTags = (tags?: string[]): string[] => {
  if (!tags) {
    return [];
  }

  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
};

const assertAuthenticated = (userId?: string): Types.ObjectId => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new AppError("Authentication is required", HTTP_STATUS.UNAUTHORIZED);
  }

  return new Types.ObjectId(userId);
};

const canReadNote = (note: Pick<INote, "owner" | "sharedWith">, userId: Types.ObjectId): boolean => {
  return note.owner.equals(userId) || note.sharedWith.some((sharedUserId) => sharedUserId.equals(userId));
};

const ensureOwner = (note: Pick<INote, "owner">, userId: Types.ObjectId): void => {
  if (!note.owner.equals(userId)) {
    throw new AppError("Only the note owner can perform this action", HTTP_STATUS.FORBIDDEN);
  }
};

const findAccessibleNote = async (
  noteId: string,
  userId: Types.ObjectId,
  includeDeleted = false,
): Promise<NoteDocument> => {
  if (!Types.ObjectId.isValid(noteId)) {
    throw new AppError("Invalid note id", HTTP_STATUS.BAD_REQUEST);
  }

  const note = await Note.findById(noteId);

  if (!note || (!includeDeleted && note.isDeleted)) {
    throw new AppError("Note not found", HTTP_STATUS.NOT_FOUND);
  }

  if (!canReadNote(note, userId)) {
    throw new AppError("You do not have access to this note", HTTP_STATUS.FORBIDDEN);
  }

  return note;
};

export const createNote = async (userId: string, payload: CreateNoteInput): Promise<NoteDocument> => {
  const owner = assertAuthenticated(userId);

  return Note.create({
    title: payload.title,
    content: payload.content,
    owner,
    tags: normalizeTags(payload.tags),
    isFavorite: payload.isFavorite ?? false,
    isPinned: payload.isPinned ?? false,
  });
};

export const listNotes = async (userId: string, query: ListNotesQuery) => {
  const currentUserId = assertAuthenticated(userId);
  const { page, limit, skip } = getPagination(query);
  const includeDeleted = query.includeDeleted === "true" || query.includeDeleted === true;

  const filter: Record<string, unknown> = {
    $or: [{ owner: currentUserId }, { sharedWith: currentUserId }],
    ...(includeDeleted ? {} : { isDeleted: false }),
  };

  if (typeof query.search === "string" && query.search.trim()) {
    filter.$text = { $search: query.search.trim() };
  }

  if (typeof query.tag === "string" && query.tag.trim()) {
    filter.tags = query.tag.trim().toLowerCase();
  }

  if (query.isFavorite === "true" || query.isFavorite === true) {
    filter.isFavorite = true;
  }

  if (query.isPinned === "true" || query.isPinned === true) {
    filter.isPinned = true;
  }

  const [notes, total] = await Promise.all([
    Note.find(filter).sort({ isPinned: -1, updatedAt: -1 }).skip(skip).limit(limit),
    Note.countDocuments(filter),
  ]);

  return {
    notes,
    meta: buildPaginationMeta(page, limit, total),
  };
};

export const getNoteById = async (userId: string, noteId: string): Promise<NoteDocument> => {
  const currentUserId = assertAuthenticated(userId);
  return findAccessibleNote(noteId, currentUserId);
};

export const updateNote = async (
  userId: string,
  noteId: string,
  payload: UpdateNoteInput,
): Promise<NoteDocument> => {
  const currentUserId = assertAuthenticated(userId);
  const note = await findAccessibleNote(noteId, currentUserId);
  ensureOwner(note, currentUserId);

  const contentChanged =
    (payload.title !== undefined && payload.title !== note.title) ||
    (payload.content !== undefined && payload.content !== note.content);

  if (contentChanged) {
    const versionCount = await NoteVersion.countDocuments({ noteId: note._id });
    await NoteVersion.create({
      noteId: note._id,
      oldTitle: note.title,
      oldContent: note.content,
      updatedBy: currentUserId,
      versionNumber: versionCount + 1,
    });
  }

  if (payload.title !== undefined) {
    note.title = payload.title;
  }

  if (payload.content !== undefined) {
    note.content = payload.content;
  }

  if (payload.tags !== undefined) {
    note.tags = normalizeTags(payload.tags);
  }

  if (payload.isFavorite !== undefined) {
    note.isFavorite = payload.isFavorite;
  }

  if (payload.isPinned !== undefined) {
    note.isPinned = payload.isPinned;
  }

  await note.save();
  return note;
};

export const softDeleteNote = async (userId: string, noteId: string): Promise<void> => {
  const currentUserId = assertAuthenticated(userId);
  const note = await findAccessibleNote(noteId, currentUserId);
  ensureOwner(note, currentUserId);

  note.isDeleted = true;
  note.deletedAt = new Date();
  await note.save();
};

export const restoreNote = async (userId: string, noteId: string): Promise<NoteDocument> => {
  const currentUserId = assertAuthenticated(userId);
  const note = await findAccessibleNote(noteId, currentUserId, true);
  ensureOwner(note, currentUserId);

  if (!note.isDeleted) {
    throw new AppError("Note is not deleted", HTTP_STATUS.BAD_REQUEST);
  }

  note.isDeleted = false;
  note.deletedAt = undefined;
  await note.save();

  return note;
};

export const shareNote = async (
  userId: string,
  noteId: string,
  targetEmail: string,
): Promise<NoteDocument> => {
  const currentUserId = assertAuthenticated(userId);
  const note = await findAccessibleNote(noteId, currentUserId);
  ensureOwner(note, currentUserId);

  const targetUser = await User.findOne({ email: targetEmail.toLowerCase() }).select("_id email");

  if (!targetUser) {
    throw new AppError("User to share with was not found", HTTP_STATUS.NOT_FOUND);
  }

  if (targetUser._id.equals(currentUserId)) {
    throw new AppError("You cannot share a note with yourself", HTTP_STATUS.BAD_REQUEST);
  }

  if (note.sharedWith.some((sharedUserId) => sharedUserId.equals(targetUser._id))) {
    throw new AppError("Note is already shared with this user", HTTP_STATUS.CONFLICT);
  }

  note.sharedWith.push(targetUser._id);
  await note.save();

  return note;
};

export const setFavorite = async (
  userId: string,
  noteId: string,
  isFavorite: boolean,
): Promise<NoteDocument> => {
  return updateNote(userId, noteId, { isFavorite });
};

export const setPinned = async (
  userId: string,
  noteId: string,
  isPinned: boolean,
): Promise<NoteDocument> => {
  return updateNote(userId, noteId, { isPinned });
};

export const listNoteVersions = async (userId: string, noteId: string) => {
  const currentUserId = assertAuthenticated(userId);
  const note = await findAccessibleNote(noteId, currentUserId, true);
  ensureOwner(note, currentUserId);

  return NoteVersion.find({ noteId: note._id }).sort({ versionNumber: -1 });
};
