import { http } from "@/api/http";
import type { ApiResponse, PaginationMeta } from "@/types/api";
import type { Note, NoteFormValues, NoteListParams, NoteVersion } from "@/types/note";

interface NoteListResult {
  notes: Note[];
  meta: PaginationMeta;
}

export const notesService = {
  async list(params: NoteListParams): Promise<NoteListResult> {
    const { data } = await http.get<ApiResponse<Note[]>>("/notes", { params });
    return {
      notes: data.data,
      meta: data.meta ?? { page: 1, limit: params.limit ?? 10, total: data.data.length, totalPages: 1 },
    };
  },

  async get(noteId: string): Promise<Note> {
    const { data } = await http.get<ApiResponse<Note>>(`/notes/${noteId}`);
    return data.data;
  },

  async create(payload: NoteFormValues): Promise<Note> {
    const { data } = await http.post<ApiResponse<Note>>("/notes", payload);
    return data.data;
  },

  async update(noteId: string, payload: Partial<NoteFormValues>): Promise<Note> {
    const { data } = await http.patch<ApiResponse<Note>>(`/notes/${noteId}`, payload);
    return data.data;
  },

  async remove(noteId: string): Promise<void> {
    await http.delete(`/notes/${noteId}`);
  },

  async restore(noteId: string): Promise<Note> {
    const { data } = await http.patch<ApiResponse<Note>>(`/notes/${noteId}/restore`);
    return data.data;
  },

  async share(noteId: string, email: string): Promise<Note> {
    const { data } = await http.post<ApiResponse<Note>>(`/notes/${noteId}/share`, { email });
    return data.data;
  },

  async favorite(noteId: string, isFavorite: boolean): Promise<Note> {
    const { data } = await http.patch<ApiResponse<Note>>(`/notes/${noteId}/favorite`, { isFavorite });
    return data.data;
  },

  async pin(noteId: string, isPinned: boolean): Promise<Note> {
    const { data } = await http.patch<ApiResponse<Note>>(`/notes/${noteId}/pin`, { isPinned });
    return data.data;
  },

  async versions(noteId: string): Promise<NoteVersion[]> {
    const { data } = await http.get<ApiResponse<NoteVersion[]>>(`/notes/${noteId}/versions`);
    return data.data;
  },
};
