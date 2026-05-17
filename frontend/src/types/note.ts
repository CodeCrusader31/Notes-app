export interface Note {
  id: string;
  title: string;
  content: string;
  owner: string;
  sharedWith: string[];
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteVersion {
  id?: string;
  noteId: string;
  oldTitle: string;
  oldContent: string;
  updatedBy: string;
  versionNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoteListParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  includeDeleted?: boolean;
}

export interface NoteFormValues {
  title: string;
  content: string;
  tags: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
}
