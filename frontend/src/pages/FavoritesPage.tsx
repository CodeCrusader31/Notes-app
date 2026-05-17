import { NotesView } from "@/features/notes/NotesView";

export function FavoritesPage() {
  return (
    <NotesView
      mode="favorites"
      title="Favorites"
      description="Your starred notes stay collected here for quick review."
    />
  );
}
