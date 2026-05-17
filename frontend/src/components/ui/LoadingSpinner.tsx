export function LoadingSpinner() {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-ink-900" />
    </div>
  );
}
