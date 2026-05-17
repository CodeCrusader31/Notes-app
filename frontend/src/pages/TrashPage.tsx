import { NotesView } from "@/features/notes/NotesView";

export function TrashPage() {
  return (
    <NotesView
      mode="trash"
      title="Trash"
      description="Restore soft-deleted notes when you need them back."
    />
  );
}
