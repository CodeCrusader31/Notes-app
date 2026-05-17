import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getApiErrorMessage } from "@/api/http";
import { notesService } from "@/services/notes.service";
import type { NoteFormValues, NoteListParams } from "@/types/note";

export const noteKeys = {
  all: ["notes"] as const,
  list: (params: NoteListParams) => [...noteKeys.all, "list", params] as const,
  versions: (noteId: string) => [...noteKeys.all, "versions", noteId] as const,
};

export const useNotesQuery = (params: NoteListParams) =>
  useQuery({
    queryKey: noteKeys.list(params),
    queryFn: () => notesService.list(params),
  });

export const useNoteVersionsQuery = (noteId: string | null) =>
  useQuery({
    queryKey: noteId ? noteKeys.versions(noteId) : [...noteKeys.all, "versions", "idle"],
    queryFn: () => notesService.versions(noteId!),
    enabled: Boolean(noteId),
  });

export const useNoteMutations = () => {
  const queryClient = useQueryClient();

  const invalidateNotes = async () => {
    await queryClient.invalidateQueries({ queryKey: noteKeys.all });
  };

  const withErrorToast = (error: unknown) => toast.error(getApiErrorMessage(error));

  return {
    createNote: useMutation({
      mutationFn: (payload: NoteFormValues) => notesService.create(payload),
      onSuccess: async () => {
        toast.success("Note created");
        await invalidateNotes();
      },
      onError: withErrorToast,
    }),
    updateNote: useMutation({
      mutationFn: ({ noteId, payload }: { noteId: string; payload: Partial<NoteFormValues> }) =>
        notesService.update(noteId, payload),
      onSuccess: async () => {
        toast.success("Note updated");
        await invalidateNotes();
      },
      onError: withErrorToast,
    }),
    deleteNote: useMutation({
      mutationFn: notesService.remove,
      onSuccess: async () => {
        toast.success("Moved to trash");
        await invalidateNotes();
      },
      onError: withErrorToast,
    }),
    restoreNote: useMutation({
      mutationFn: notesService.restore,
      onSuccess: async () => {
        toast.success("Note restored");
        await invalidateNotes();
      },
      onError: withErrorToast,
    }),
    shareNote: useMutation({
      mutationFn: ({ noteId, email }: { noteId: string; email: string }) =>
        notesService.share(noteId, email),
      onSuccess: async () => {
        toast.success("Note shared");
        await invalidateNotes();
      },
      onError: withErrorToast,
    }),
    favoriteNote: useMutation({
      mutationFn: ({ noteId, isFavorite }: { noteId: string; isFavorite: boolean }) =>
        notesService.favorite(noteId, isFavorite),
      onSuccess: invalidateNotes,
      onError: withErrorToast,
    }),
    pinNote: useMutation({
      mutationFn: ({ noteId, isPinned }: { noteId: string; isPinned: boolean }) =>
        notesService.pin(noteId, isPinned),
      onSuccess: invalidateNotes,
      onError: withErrorToast,
    }),
  };
};
