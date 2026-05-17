import { NotesView } from "@/features/notes/NotesView";

export function SharedNotesPage() {
  return (
    <NotesView
      mode="shared"
      title="Shared notes"
      description="Notes shared with you are visible here. Owner-only actions remain protected by the API."
    />
  );
}
