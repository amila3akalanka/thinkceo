"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Icon, IconBadge } from "@/components/Icon";
import { btnGhost, card, chip } from "@/components/ui";
import { CHANGELOG } from "@/content/changelog";
import packageJson from "@/package.json";

export default function AboutPage() {
  const [latest, ...older] = CHANGELOG;

  return (
    <AppShell>
      <div className="rounded-3xl bg-linear-to-br from-violet-500 to-violet-700 p-6 text-center text-white shadow-xl shadow-violet-300/50">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white/20">
          <Icon name="crown" className="h-10 w-10" />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold">ThinkCEO</h1>
        <p className="mt-1 text-violet-100">Train your CEO mindset with real business decisions.</p>
        <span className={`${chip} mt-4 bg-white text-violet-700`}>Version {packageJson.version}</span>
      </div>

      <div className={`${card} mt-4 flex items-center gap-4`}>
        <IconBadge name="user" tone="orange" />
        <div>
          <p className="text-xs font-bold text-violet-400 uppercase">Developed by</p>
          <p className="text-lg font-extrabold">Amila Akalanka</p>
        </div>
      </div>

      <div className={`${card} mt-4`}>
        <div className="flex items-center justify-between">
          <p className="font-extrabold">What&apos;s new in {latest.version}</p>
          <span className="text-xs font-bold text-violet-400">{latest.date}</span>
        </div>
        <p className="text-sm text-violet-900/60">{latest.title}</p>
        <ul className="mt-4 space-y-3">
          {latest.changes.map((change) => (
            <li key={change.text} className="flex items-start gap-3">
              <IconBadge name={change.icon} tone="soft" size="sm" />
              <p className="pt-1.5 text-sm">{change.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {older.length > 0 && (
        <details className={`${card} mt-4`}>
          <summary className="cursor-pointer font-extrabold">Earlier versions</summary>
          <div className="mt-4 space-y-4">
            {older.map((release) => (
              <div key={release.version}>
                <p className="text-sm font-bold">
                  {release.version} · {release.title}
                  <span className="ml-2 text-xs font-semibold text-violet-400">{release.date}</span>
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-violet-900/70">
                  {release.changes.map((change) => (
                    <li key={change.text}>{change.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      )}

      <Link href="/" className={`${btnGhost} mt-4`}>
        <Icon name="arrowLeft" /> Back home
      </Link>
    </AppShell>
  );
}
