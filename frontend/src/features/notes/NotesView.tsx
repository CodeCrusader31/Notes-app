import { AnimatePresence } from "framer-motion";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { NotesSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { HistoryModal } from "@/features/notes/HistoryModal";
import { NoteCard } from "@/features/notes/NoteCard";
import { NoteEditorModal } from "@/features/notes/NoteEditorModal";
import { SearchBar } from "@/features/notes/SearchBar";
import { ShareModal } from "@/features/notes/ShareModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useNoteMutations, useNotesQuery } from "@/hooks/useNotes";
import type { Note, NoteFormValues, NoteListParams } from "@/types/note";

interface NotesViewProps {
  title: string;
  description: string;
  mode?: "all" | "favorites" | "trash" | "shared";
}

const PAGE_SIZE = 9;

export function NotesView({ title, description, mode = "all" }: NotesViewProps) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [shareNote, setShareNote] = useState<Note | null>(null);
  const [historyNote, setHistoryNote] = useState<Note | null>(null);

  const debouncedSearch = useDebounce(search);
  const debouncedTag = useDebounce(tag);
  const mutations = useNoteMutations();

  const queryParams = useMemo<NoteListParams>(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      tag: debouncedTag || undefined,
      isFavorite: mode === "favorites" ? true : undefined,
      isPinned: showPinnedOnly ? true : undefined,
      includeDeleted: mode === "trash",
    }),
    [debouncedSearch, debouncedTag, mode, page, showPinnedOnly],
  );

  const { data, isError, isLoading } = useNotesQuery(queryParams);

  const visibleNotes = useMemo(() => {
    const notes = data?.notes ?? [];

    if (mode === "trash") {
      return notes.filter((note) => note.isDeleted);
    }

    if (mode === "shared") {
      return notes.filter((note) => note.owner !== user?.id && !note.isDeleted);
    }

    return notes.filter((note) => !note.isDeleted);
  }, [data?.notes, mode, user?.id]);

  const openCreateModal = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleSave = (values: NoteFormValues) => {
    if (editingNote) {
      mutations.updateNote.mutate(
        { noteId: editingNote.id, payload: values },
        {
          onSuccess: () => {
            setIsEditorOpen(false);
            setEditingNote(null);
          },
        },
      );
      return;
    }

    mutations.createNote.mutate(values, {
      onSuccess: () => setIsEditorOpen(false),
    });
  };

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-ink-500">Notes workspace</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink-900">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">{description}</p>
        </div>
        {mode !== "trash" ? (
          <Button icon={<Plus size={18} />} type="button" onClick={openCreateModal}>
            New note
          </Button>
        ) : null}
      </div>

      <div className="mb-5">
        <SearchBar
          search={search}
          showPinnedOnly={showPinnedOnly}
          tag={tag}
          onPinnedChange={(value) => {
            setShowPinnedOnly(value);
            setPage(1);
          }}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onTagChange={(value) => {
            setTag(value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? <NotesSkeleton /> : null}

      {isError ? (
        <EmptyState
          icon={<FileText size={22} />}
          title="Unable to load notes"
          description="The API request failed. Confirm the backend is running and the frontend environment URL is correct."
        />
      ) : null}

      {!isLoading && !isError && visibleNotes.length === 0 ? (
        <EmptyState
          icon={mode === "trash" ? <Trash2 size={22} /> : <FileText size={22} />}
          title={mode === "trash" ? "Trash is empty" : "No notes found"}
          description={
            mode === "trash"
              ? "Deleted notes will appear here and can be restored."
              : "Create a note or adjust search and filter criteria."
          }
          action={mode !== "trash" ? <Button icon={<Plus size={18} />} onClick={openCreateModal}>Create note</Button> : null}
        />
      ) : null}

      {!isLoading && visibleNotes.length ? (
        <AnimatePresence>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleNotes.map((note) => (
              <NoteCard
                key={note.id}
                currentUserId={user?.id}
                note={note}
                onDelete={(target) => mutations.deleteNote.mutate(target.id)}
                onEdit={(target) => {
                  setEditingNote(target);
                  setIsEditorOpen(true);
                }}
                onFavorite={(target) =>
                  mutations.favoriteNote.mutate({ noteId: target.id, isFavorite: !target.isFavorite })
                }
                onHistory={setHistoryNote}
                onPin={(target) => mutations.pinNote.mutate({ noteId: target.id, isPinned: !target.isPinned })}
                onRestore={(target) => mutations.restoreNote.mutate(target.id)}
                onShare={setShareNote}
              />
            ))}
          </div>
        </AnimatePresence>
      ) : null}

      {data?.meta ? (
        <div className="mt-6">
          <Pagination meta={data.meta} onPageChange={setPage} />
        </div>
      ) : null}

      <NoteEditorModal
        isOpen={isEditorOpen}
        isSaving={mutations.createNote.isPending || mutations.updateNote.isPending}
        note={editingNote}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNote(null);
        }}
        onSubmit={handleSave}
      />
      <ShareModal
        isOpen={Boolean(shareNote)}
        isSharing={mutations.shareNote.isPending}
        note={shareNote}
        onClose={() => setShareNote(null)}
        onShare={(email) => {
          if (!shareNote) {
            return;
          }
          mutations.shareNote.mutate(
            { noteId: shareNote.id, email },
            {
              onSuccess: () => setShareNote(null),
            },
          );
        }}
      />
      <HistoryModal isOpen={Boolean(historyNote)} note={historyNote} onClose={() => setHistoryNote(null)} />
    </main>
  );
}
