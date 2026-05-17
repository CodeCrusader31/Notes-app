import { BookOpen, Code2, ShieldCheck } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const features = [
  "JWT authentication",
  "Notes CRUD with search and pagination",
  "Sharing, favorites, pinned notes, tags, trash, and version history",
  "Swagger/OpenAPI at /api/v1/docs/openapi.json",
];

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="max-w-4xl">
        <p className="text-sm font-medium text-ink-500">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-900">Account and API overview</h1>
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-ink-100 bg-white p-5">
            <ShieldCheck className="text-ink-700" />
            <p className="mt-4 text-sm text-ink-500">Authenticated user</p>
            <p className="mt-1 break-all font-medium text-ink-900">{user?.email}</p>
          </div>
          <div className="rounded-xl border border-ink-100 bg-white p-5 md:col-span-2">
            <BookOpen className="text-ink-700" />
            <h2 className="mt-4 text-lg font-semibold text-ink-900">Backend capabilities</h2>
            <ul className="mt-3 grid gap-2 text-sm text-ink-600">
              {features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Code2 className="mt-0.5 shrink-0 text-ink-400" size={16} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
