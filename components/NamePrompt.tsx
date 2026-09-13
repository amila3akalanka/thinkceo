"use client";

import { useState } from "react";
import { IconBadge } from "./Icon";
import { NameForm } from "./NameForm";
import { useProgress } from "./ProgressProvider";

const SKIP_KEY = "thinkceo:skip-name";

/** Asks newly signed-up users for their name once they're signed in. */
export function NamePrompt() {
  const { user, progress } = useProgress();
  const [skipped, setSkipped] = useState(() => {
    try {
      return typeof window !== "undefined" && sessionStorage.getItem(SKIP_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (!user || !progress || progress.displayName || skipped) return null;

  function skip() {
    try {
      sessionStorage.setItem(SKIP_KEY, "1");
    } catch {
      // Storage blocked: skipping still works for this page view.
    }
    setSkipped(true);
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-violet-950/40 p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl" role="dialog" aria-labelledby="name-prompt-title">
        <div className="text-center">
          <IconBadge name="user" tone="violet" size="lg" />
          <h2 id="name-prompt-title" className="mt-4 text-2xl font-extrabold">
            Welcome to ThinkCEO!
          </h2>
          <p className="mt-1 text-sm text-violet-900/60">What should we call you?</p>
        </div>
        <div className="mt-5">
          <NameForm submitLabel="Save my name" />
        </div>
        <button type="button" onClick={skip} className="mt-3 w-full text-sm font-bold text-violet-400">
          Skip for now
        </button>
      </div>
    </div>
  );
}
