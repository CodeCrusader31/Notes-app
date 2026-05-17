import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-ink-50 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-ink-900 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-ink-900">
            N
          </div>
          <h1 className="mt-10 max-w-lg text-4xl font-semibold leading-tight">
            A focused workspace for notes, sharing, and versioned edits.
          </h1>
        </div>
        <div className="grid gap-4 text-sm text-ink-200">
          <p>JWT authentication, private notes, soft delete, favorites, pinned notes, and history.</p>
          <p className="text-ink-500">Connected to the existing Notes App API.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-10">
        <Outlet />
      </section>
    </main>
  );
}
