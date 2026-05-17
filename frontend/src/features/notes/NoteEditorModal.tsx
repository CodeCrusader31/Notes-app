import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import type { Note, NoteFormValues } from "@/types/note";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(160, "Title must be under 160 characters"),
  content: z.string().min(1, "Content is required").max(20000, "Content is too long"),
  tagsText: z.string().optional(),
  isFavorite: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

type NoteEditorValues = z.infer<typeof noteSchema>;

interface NoteEditorModalProps {
  note: Note | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => void;
}

const toTags = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

export function NoteEditorModal({ note, isOpen, isSaving, onClose, onSubmit }: NoteEditorModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteEditorValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      tagsText: "",
      isFavorite: false,
      isPinned: false,
    },
  });

  useEffect(() => {
    reset({
      title: note?.title ?? "",
      content: note?.content ?? "",
      tagsText: note?.tags.join(", ") ?? "",
      isFavorite: note?.isFavorite ?? false,
      isPinned: note?.isPinned ?? false,
    });
  }, [note, reset, isOpen]);

  const submit = (values: NoteEditorValues) => {
    onSubmit({
      title: values.title,
      content: values.content,
      tags: toTags(values.tagsText),
      isFavorite: values.isFavorite,
      isPinned: values.isPinned,
    });
  };

  return (
    <Modal isOpen={isOpen} size="lg" title={note ? "Edit note" : "Create note"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
        <Input id="title" label="Title" error={errors.title?.message} {...register("title")} />
        <Textarea id="content" label="Content" error={errors.content?.message} {...register("content")} />
        <Input
          id="tags"
          label="Tags"
          placeholder="work, ideas, roadmap"
          error={errors.tagsText?.message}
          {...register("tagsText")}
        />
        <div className="flex flex-wrap gap-4 rounded-lg bg-ink-50 p-3">
          <Controller
            control={control}
            name="isPinned"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  checked={Boolean(field.value)}
                  className="h-4 w-4 rounded border-ink-300"
                  type="checkbox"
                  onChange={(event) => field.onChange(event.target.checked)}
                />
                Pin note
              </label>
            )}
          />
          <Controller
            control={control}
            name="isFavorite"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  checked={Boolean(field.value)}
                  className="h-4 w-4 rounded border-ink-300"
                  type="checkbox"
                  onChange={(event) => field.onChange(event.target.checked)}
                />
                Mark favorite
              </label>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isSaving} icon={<Save size={18} />} type="submit">
            {isSaving ? "Saving..." : "Save note"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
