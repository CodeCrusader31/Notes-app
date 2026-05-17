export function NotesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-56 animate-pulse rounded-xl border border-ink-100 bg-white p-5">
          <div className="h-5 w-2/3 rounded bg-ink-100" />
          <div className="mt-4 space-y-2">
            <div className="h-3 rounded bg-ink-100" />
            <div className="h-3 rounded bg-ink-100" />
            <div className="h-3 w-4/5 rounded bg-ink-100" />
          </div>
          <div className="mt-8 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-ink-100" />
            <div className="h-6 w-20 rounded-full bg-ink-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
