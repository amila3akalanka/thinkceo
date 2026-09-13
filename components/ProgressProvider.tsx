"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { emptyProgress } from "@/lib/progress";
import { getStore, type SessionUser } from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import type { AssessmentResult, Attempt, AttemptInput, ModuleId, Progress } from "@/lib/types";

type ProgressContextValue = {
  progress: Progress | null;
  user: SessionUser | null;
  error: string | null;
  refresh(): Promise<void>;
  saveAssessment(result: AssessmentResult, path: ModuleId[]): Promise<void>;
  recordAttempt(input: AttemptInput): Promise<Attempt>;
  signOut(): Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

const message = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const { store, user } = await getStore();
      setUser(user);
      setProgress(await store.getProgress());
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

  const signOut = useCallback(async () => {
    await getSupabase()?.auth.signOut();
    await refresh();
  }, [refresh]);

  return (
    <ProgressContext.Provider value={{ progress, user, error, refresh, saveAssessment, recordAttempt, signOut }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
