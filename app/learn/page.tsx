"use client";

import Link from "next/link";
import { AppShell, Loading } from "@/components/AppShell";
import { Icon, IconBadge } from "@/components/Icon";
import { useProgress } from "@/components/ProgressProvider";
import { card } from "@/components/ui";
import { LEARN_CATEGORIES, LESSONS, lessonsIn } from "@/content/learn";
import { LEARN_CATEGORY_IDS } from "@/lib/learn";
import type { LessonResult } from "@/lib/types";

export default function LearnPage() {
  const { progress } = useProgress();
  if (!progress) return <AppShell><Loading /></AppShell>;

  // Best result per lesson.
  const best = new Map<string, LessonResult>();
  for (const r of progress.lessons) {
    const prev = best.get(r.lessonId);
    if (!prev || r.correct / r.total > prev.correct / prev.total) best.set(r.lessonId, r);
  }
  const next = LESSONS.find((l) => !best.has(l.id));

  return (
    <AppShell>
      {next ? (
        <div className="rounded-3xl bg-linear-to-br from-violet-500 to-violet-700 p-5 text-white shadow-xl shadow-violet-300/50">
          <p className="text-sm font-semibold text-violet-100">Next lesson</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
              <Icon name={next.icon} className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xl font-extrabold">{next.title}</p>
              <p className="text-sm text-violet-100">
                {LEARN_CATEGORIES[next.category].title} · {next.minutes} min
              </p>
            </div>
          </div>
          <Link
            href={`/learn/${next.id}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-bold text-violet-700 transition active:scale-[.98]"
          >
            <Icon name="book" /> Start lesson
          </Link>
        </div>
      ) : (
        <div className={`${card} text-center`}>
          <IconBadge name="graduation" tone="orange" size="lg" />
          <p className="mt-3 text-xl font-extrabold">Every lesson done!</p>
          <p className="text-sm text-violet-900/60">Retake any quiz below to sharpen up.</p>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 rounded-2xl bg-orange-50 px-4 py-3 text-xs text-orange-800 ring-1 ring-orange-200">
        <Icon name="scale" className="mt-0.5 h-4 w-4 shrink-0" />
        Simplified lessons for learning, not financial, tax or legal advice. Sri Lanka facts include official sources.
      </p>

      <div className="mt-6 space-y-4">
        {LEARN_CATEGORY_IDS.map((categoryId) => {
          const meta = LEARN_CATEGORIES[categoryId];
          const lessons = lessonsIn(categoryId);
          const done = lessons.filter((l) => best.has(l.id)).length;
          return (
            <section key={categoryId} className={card}>
              <div className="flex items-center gap-3">
                <IconBadge name={meta.icon} tone={meta.tone} />
                <div className="flex-1">
                  <p className="font-extrabold">{meta.title}</p>
                  <p className="text-xs text-violet-900/60">{meta.tagline}</p>
                </div>
                <span className="text-sm font-bold text-violet-500">
                  {done}/{lessons.length}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-violet-500 to-orange-400"
                  style={{ width: `${(done / lessons.length) * 100}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2">
                {lessons.map((lesson) => {
                  const result = best.get(lesson.id);
                  const isNext = next?.id === lesson.id;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/learn/${lesson.id}`}
                        className={`flex items-center gap-3 rounded-2xl p-2 transition hover:bg-violet-50 ${isNext ? "bg-violet-50 ring-1 ring-violet-200" : ""}`}
                      >
                        <IconBadge name={lesson.icon} tone={result ? "green" : isNext ? "soft" : "soft"} size="sm" />
                        <div className="flex-1">
                          <p className="text-sm font-bold">{lesson.title}</p>
                          <p className="text-xs text-violet-900/50">
                            {lesson.minutes} min · {lesson.quiz.length} questions
                          </p>
                        </div>
                        {result ? (
                          <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                            <Icon name="check" className="h-4 w-4" /> {result.correct}/{result.total}
                          </span>
                        ) : (
                          <Icon name={isNext ? "play" : "chevron"} className={`h-5 w-5 ${isNext ? "text-violet-600" : "text-violet-300"}`} />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
