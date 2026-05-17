import { motion } from "framer-motion";
import { Clock, History, MoreVertical, Pin, PinOff, Share2, Star, Trash2, Undo2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import type { Note } from "@/types/note";
import { formatDateTime } from "@/utils/date";
import { cn } from "@/utils/cn";

interface NoteCardProps {
  note: Note;
  currentUserId?: string;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onRestore: (note: Note) => void;
  onShare: (note: Note) => void;
  onHistory: (note: Note) => void;
  onFavorite: (note: Note) => void;
  onPin: (note: Note) => void;
}

export function NoteCard({
  note,
  currentUserId,
  onEdit,
  onDelete,
  onRestore,
  onShare,
  onHistory,
  onFavorite,
  onPin,
}: NoteCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOwner = note.owner === currentUserId;

  return (
    <motion.article
      layout
      className={cn(
        "group relative flex min-h-56 flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft",
        note.isPinned ? "border-ink-300" : "border-ink-100",
        note.isDeleted && "opacity-80",
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-3">
        <button className="min-w-0 text-left" type="button" onClick={() => !note.isDeleted && onEdit(note)}>
          <h3 className="line-clamp-2 text-lg font-semibold text-ink-900">{note.title}</h3>
        </button>
        <div className="relative shrink-0">
          <Button
            aria-label="Open note actions"
            icon={<MoreVertical size={18} />}
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => setIsMenuOpen((value) => !value)}
          />
          {isMenuOpen ? (
            <div className="absolute right-0 top-10 z-10 w-44 rounded-lg border border-ink-100 bg-white p-1 text-sm shadow-soft">
              {!note.isDeleted ? (
                <>
                  <button className="w-full rounded-md px-3 py-2 text-left hover:bg-ink-50" type="button" onClick={() => onEdit(note)}>
                    Edit
                  </button>
                  <button className="w-full rounded-md px-3 py-2 text-left hover:bg-ink-50" type="button" onClick={() => onShare(note)}>
                    Share
                  </button>
                  <button className="w-full rounded-md px-3 py-2 text-left hover:bg-ink-50" type="button" onClick={() => onHistory(note)}>
                    History
                  </button>
                  <button className="w-full rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50" type="button" onClick={() => onDelete(note)}>
                    Delete
                  </button>
                </>
              ) : (
                <button className="w-full rounded-md px-3 py-2 text-left hover:bg-ink-50" type="button" onClick={() => onRestore(note)}>
                  Restore
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-3 line-clamp-5 whitespace-pre-line text-sm leading-6 text-ink-600">{note.content}</p>

      {note.tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <div className="flex min-w-0 items-center gap-1 text-xs text-ink-500">
          <Clock size={14} />
          <span className="truncate">{formatDateTime(note.updatedAt)}</span>
        </div>
        <div className="flex shrink-0 gap-1">
          {!note.isDeleted ? (
            <>
              <Button
                aria-label={note.isPinned ? "Unpin note" : "Pin note"}
                icon={note.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => onPin(note)}
              />
              <Button
                aria-label={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
                className={note.isFavorite ? "text-amber-500" : undefined}
                icon={<Star size={16} fill={note.isFavorite ? "currentColor" : "none"} />}
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => onFavorite(note)}
              />
              {isOwner ? (
                <>
                  <Button aria-label="Share note" icon={<Share2 size={16} />} size="icon" type="button" variant="ghost" onClick={() => onShare(note)} />
                  <Button aria-label="Version history" icon={<History size={16} />} size="icon" type="button" variant="ghost" onClick={() => onHistory(note)} />
                  <Button aria-label="Delete note" icon={<Trash2 size={16} />} size="icon" type="button" variant="ghost" onClick={() => onDelete(note)} />
                </>
              ) : null}
            </>
          ) : (
            <Button icon={<Undo2 size={16} />} size="sm" type="button" variant="secondary" onClick={() => onRestore(note)}>
              Restore
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
