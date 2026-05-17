import type { Request } from "express";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import {
  createNote,
  getNoteById,
  listNoteVersions,
  listNotes,
  restoreNote,
  setFavorite,
  setPinned,
  shareNote,
  softDeleteNote,
  updateNote,
} from "../services/note.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

const getCurrentUserId = (req: Request): string => req.user?.id ?? "";
const getNoteId = (req: Request): string => String(req.params.noteId);

export const getNotes = asyncHandler(async (req, res) => {
  const result = await listNotes(getCurrentUserId(req), req.query);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Notes fetched successfully",
    data: result.notes,
    meta: result.meta,
  });
});

export const getNote = asyncHandler(async (req, res) => {
  const note = await getNoteById(getCurrentUserId(req), getNoteId(req));

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Note fetched successfully",
    data: note,
  });
});

export const create = asyncHandler(async (req, res) => {
  const note = await createNote(getCurrentUserId(req), req.body);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.CREATED,
    message: "Note created successfully",
    data: note,
  });
});

export const update = asyncHandler(async (req, res) => {
  const note = await updateNote(getCurrentUserId(req), getNoteId(req), req.body);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Note updated successfully",
    data: note,
  });
});

export const remove = asyncHandler(async (req, res) => {
  await softDeleteNote(getCurrentUserId(req), getNoteId(req));

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Note deleted successfully",
  });
});

export const restore = asyncHandler(async (req, res) => {
  const note = await restoreNote(getCurrentUserId(req), getNoteId(req));

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Note restored successfully",
    data: note,
  });
});

export const share = asyncHandler(async (req, res) => {
  const note = await shareNote(getCurrentUserId(req), getNoteId(req), req.body.email);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Note shared successfully",
    data: note,
  });
});

export const favorite = asyncHandler(async (req, res) => {
  const note = await setFavorite(getCurrentUserId(req), getNoteId(req), req.body.isFavorite);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Favorite status updated successfully",
    data: note,
  });
});

export const pin = asyncHandler(async (req, res) => {
  const note = await setPinned(getCurrentUserId(req), getNoteId(req), req.body.isPinned);

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Pinned status updated successfully",
    data: note,
  });
});

export const versions = asyncHandler(async (req, res) => {
  const history = await listNoteVersions(getCurrentUserId(req), getNoteId(req));

  sendSuccess({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Note version history fetched successfully",
    data: history,
  });
});
