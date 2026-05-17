import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-ink-100 p-3 text-ink-700">{icon}</div>
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
