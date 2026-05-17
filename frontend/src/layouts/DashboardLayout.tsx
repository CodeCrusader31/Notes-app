import { Menu, Search, StickyNote, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ArchiveRestore, Heart, Share2, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";

const navItems = [
  { to: "/", label: "All Notes", icon: ArchiveRestore },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/shared", label: "Shared", icon: Share2 },
  { to: "/trash", label: "Trash", icon: Trash2 },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-ink-50">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-ink-100 bg-white px-4 py-5 transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">
              <StickyNote size={20} />
            </div>
            <div>
              <p className="font-semibold text-ink-900">Notes App</p>
              <p className="text-xs text-ink-500">Production dashboard</p>
            </div>
          </div>
          <Button
            aria-label="Close sidebar"
            className="lg:hidden"
            icon={<X size={18} />}
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>

        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-ink-100 bg-ink-50 p-3">
          <p className="truncate text-sm font-medium text-ink-900">{user?.email}</p>
          <Button className="mt-3 w-full" size="sm" type="button" variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </aside>

      {isSidebarOpen ? (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-ink-900/30 lg:hidden"
          type="button"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                aria-label="Open sidebar"
                className="lg:hidden"
                icon={<Menu size={18} />}
                size="icon"
                type="button"
                variant="secondary"
                onClick={() => setIsSidebarOpen(true)}
              />
              <div className="hidden items-center gap-2 rounded-lg border border-ink-100 bg-ink-50 px-3 py-2 text-sm text-ink-500 sm:flex">
                <Search size={16} />
                Search, filter, edit, and share notes
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-500">Signed in as</p>
              <p className="max-w-48 truncate text-sm font-medium text-ink-900">{user?.email}</p>
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
