import { History } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { useNoteVersionsQuery } from "@/hooks/useNotes";
import type { Note } from "@/types/note";
import { formatDateTime } from "@/utils/date";

interface HistoryModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ note, isOpen, onClose }: HistoryModalProps) {
  const { data, isLoading } = useNoteVersionsQuery(isOpen ? note?.id ?? null : null);

  return (
    <Modal isOpen={isOpen} size="lg" title="Version history" onClose={onClose}>
      {isLoading ? <LoadingSpinner /> : null}
      {!isLoading && !data?.length ? (
        <EmptyState
          icon={<History size={22} />}
          title="No previous versions"
          description="Versions appear after the note title or content is edited."
        />
      ) : null}
      {!isLoading && data?.length ? (
        <div className="grid gap-3">
          {data.map((version) => (
            <article key={`${version.noteId}-${version.versionNumber}`} className="rounded-lg border border-ink-100 bg-ink-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-ink-900">Version {version.versionNumber}</h3>
                <span className="text-xs text-ink-500">{formatDateTime(version.createdAt)}</span>
              </div>
              <p className="mt-3 font-medium text-ink-900">{version.oldTitle}</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink-600">{version.oldContent}</p>
            </article>
          ))}
        </div>
      ) : null}
    </Modal>
  );
}
