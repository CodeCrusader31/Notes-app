import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Note } from "@/types/note";

const shareSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ShareValues = z.infer<typeof shareSchema>;

interface ShareModalProps {
  note: Note | null;
  isOpen: boolean;
  isSharing: boolean;
  onClose: () => void;
  onShare: (email: string) => void;
}

export function ShareModal({ note, isOpen, isSharing, onClose, onShare }: ShareModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShareValues>({
    resolver: zodResolver(shareSchema),
  });

  useEffect(() => {
    reset({ email: "" });
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} title="Share note" onClose={onClose}>
      <p className="mb-4 text-sm text-ink-500">
        Share <span className="font-medium text-ink-900">{note?.title}</span> with a registered user.
      </p>
      <form
        className="grid gap-4"
        onSubmit={handleSubmit((values) => {
          onShare(values.email);
        })}
      >
        <Input id="shareEmail" label="Recipient email" type="email" error={errors.email?.message} {...register("email")} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isSharing} icon={<Send size={18} />} type="submit">
            {isSharing ? "Sharing..." : "Share"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
