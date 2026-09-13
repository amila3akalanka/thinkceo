"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nextScenario } from "@/lib/pathBuilder";
import { displayStreak } from "@/lib/progress";
import { Icon, IconBadge } from "./Icon";
import { useProgress } from "./ProgressProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { progress, error } = useProgress();
  const pathname = usePathname();
  const next = progress ? nextScenario(progress.path, progress.attempts) : null;
  const streak = progress ? displayStreak(progress, new Date()) : 0;

  const nav = [
    { href: "/path", label: "Path", icon: "map", match: "/path" },
    { href: next ? `/play/${next.id}` : "/path", label: "Play", icon: "play", match: "/play" },
    { href: "/profile", label: "Profile", icon: "user", match: "/profile" },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-canvas/90 px-5 py-3 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <IconBadge name="crown" tone="violet" size="sm" />
          ThinkCEO
        </Link>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-orange-600" title="Day streak">
            <Icon name="flame" className="h-4 w-4" />
            {streak}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-violet-700" title="Experience points">
            <Icon name="star" className="h-4 w-4" />
            {progress?.xp ?? 0} XP
          </span>
        </div>
      </header>

      {error && (
        <p className="mx-5 mb-2 rounded-2xl bg-orange-50 px-4 py-2 text-sm text-orange-700 ring-1 ring-orange-200">
          Sync issue: {error}
        </p>
      )}

      <main className="flex-1 px-5 pt-2 pb-28">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-md justify-around border-t border-violet-100 bg-white/95 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
        {nav.map((item) => {
          const active = pathname.startsWith(item.match);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs font-bold ${active ? "text-violet-700" : "text-violet-400"}`}
            >
              <span className={`grid h-9 w-14 place-items-center rounded-full ${active ? "bg-violet-100" : ""}`}>
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Loading() {
  return (
    <div className="grid place-items-center py-24 text-violet-500">
      <Icon name="loader" className="h-8 w-8 animate-spin" />
    </div>
  );
}
