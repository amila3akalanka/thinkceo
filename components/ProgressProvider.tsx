"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { BADGES, earnedBadgeIds, type Badge } from "@/lib/badges";
import { emptyProgress } from "@/lib/progress";
import { getStore, type SessionUser } from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import type {
  AssessmentResult,
  Attempt,
  AttemptInput,
  LessonResult,
  LessonResultInput,
  ModuleId,
  Progress,
} from "@/lib/types";

type ProgressContextValue = {
  progress: Progress | null;
  user: SessionUser | null;
  error: string | null;
  /** Badges earned since the page loaded, shown one at a time as a toast. */
  unlocked: Badge[];
  dismissUnlocked(): void;
  refresh(): Promise<void>;
  saveAssessment(result: AssessmentResult, path: ModuleId[]): Promise<void>;
  recordAttempt(input: AttemptInput): Promise<Attempt>;
  recordLesson(input: LessonResultInput): Promise<LessonResult>;
  saveDisplayName(name: string): Promise<void>;
  signOut(): Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

const message = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<Badge[]>([]);
  // Earned badges from the previous load, per account, so signing in doesn't replay old badges.
  const baseline = useRef<{ account: string; ids: Set<string> } | null>(null);

  const refresh = useCallback(async () => {
    try {
      const { store, user } = await getStore();
      const next = await store.getProgress();
      const account = user?.email ?? "guest";
      const ids = earnedBadgeIds(next);
      const previous = baseline.current;
      if (previous && previous.account === account) {
        const fresh = BADGES.filter((b) => ids.has(b.id) && !previous.ids.has(b.id));
        if (fresh.length) setUnlocked((queue) => [...queue, ...fresh]);
      }
      baseline.current = { account, ids };
      setUser(user);
      setProgress(next);
      setError(null);
    } catch (e) {
      setError(message(e));
      setProgress((p) => p ?? emptyProgress());
    }
  }, []);

  useEffect(() => {
    void refresh();
    const subscription = getSupabase()?.auth.onAuthStateChange(() => void refresh());
    return () => subscription?.data.subscription.unsubscribe();
  }, [refresh]);

  const saveAssessment = useCallback(
    async (result: AssessmentResult, path: ModuleId[]) => {
      const { store } = await getStore();
      await store.saveAssessment(result, path);
      await refresh();
    },
    [refresh],
  );

  const recordAttempt = useCallback(
    async (input: AttemptInput) => {
      const { store } = await getStore();
      const attempt = await store.recordAttempt(input);
      await refresh();
      return attempt;
    },
    [refresh],
  );

  const recordLesson = useCallback(
    async (input: LessonResultInput) => {
      const { store } = await getStore();
      const result = await store.recordLesson(input);
      await refresh();
      return result;
    },
    [refresh],
  );

  const saveDisplayName = useCallback(
    async (name: string) => {
      const { store } = await getStore();
      await store.saveDisplayName(name);
      await refresh();
    },
    [refresh],
  );

  const signOut = useCallback(async () => {
    await getSupabase()?.auth.signOut();
    await refresh();
  }, [refresh]);

  const dismissUnlocked = useCallback(() => setUnlocked((queue) => queue.slice(1)), []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        user,
        error,
        unlocked,
        dismissUnlocked,
        refresh,
        saveAssessment,
        recordAttempt,
        recordLesson,
        saveDisplayName,
        signOut,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
