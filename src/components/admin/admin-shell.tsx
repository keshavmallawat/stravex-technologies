"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { adminNavItems } from "@/data/admin-nav";
import { Logo } from "@/components/logo";
import { NotificationsBell } from "@/components/admin/notifications-bell";

interface AdminShellProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null };
  signOutAction: () => Promise<void>;
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="mt-3 flex flex-col gap-1">
      {adminNavItems.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`flex cursor-pointer items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-colors duration-150 ${
                active
                  ? "border-brand bg-night-elevated text-white"
                  : "border-transparent text-night-muted hover:border-night-border hover:bg-night-elevated/60 hover:text-white"
              }`}
            >
              <Icon size={17} weight={active ? "fill" : "regular"} className={active ? "text-brand" : ""} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminShell({ children, user, signOutAction }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLabel =
    adminNavItems.find((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    )?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-mist">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-night-border bg-night lg:flex">
        <div className="flex h-20 items-center border-b border-night-border px-6">
          <Link href="/admin" className="cursor-pointer">
            <Logo dark className="h-8 w-32 md:h-8 md:w-32" />
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Admin">
          <span className="font-mono-label px-3 text-[10px] uppercase text-night-muted/60">
            [ CMS ]
          </span>
          <NavList />
        </nav>
        <div className="border-t border-night-border p-4">
          <Link
            href="/"
            target="_blank"
            className="font-mono-label block cursor-pointer px-2 py-2 text-[10px] uppercase text-night-muted/70 transition-colors hover:text-brand"
          >
            [ View Live Site ]
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="relative flex h-full w-72 flex-col bg-night">
            <div className="flex h-20 items-center justify-between border-b border-night-border px-6">
              <Logo dark className="h-8 w-32" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="font-mono-label cursor-pointer border border-night-border px-3 py-1.5 text-[10px] uppercase text-night-muted"
              >
                [ Close ]
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-6">
              <NavList onNavigate={() => setMobileOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      {/* Content column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-ink/10 bg-white px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="font-mono-label cursor-pointer border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 lg:hidden"
            >
              [ Menu ]
            </button>
            <div>
              <span className="font-mono-label text-[10px] uppercase text-ink/40">
                [ Admin ]
              </span>
              <h1 className="text-lg font-semibold text-ink">{currentLabel}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationsBell />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">{user.name ?? "Admin"}</p>
              <p className="text-xs text-ink/45">{user.email}</p>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="flex h-9 w-9 cursor-pointer items-center justify-center border border-ink/15 text-ink/60 transition-colors hover:border-brand hover:text-brand"
              >
                <SignOut size={16} />
              </button>
            </form>
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
