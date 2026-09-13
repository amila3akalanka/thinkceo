import type { SupabaseClient } from "@supabase/supabase-js";
import { applyAttempt, emptyProgress } from "./progress";
import { getSupabase } from "./supabase";
import type { AssessmentResult, Attempt, AttemptInput, ModuleId, Progress } from "./types";

export interface ProgressStore {
  kind: "local" | "cloud";
  getProgress(): Promise<Progress>;
  saveAssessment(result: AssessmentResult, path: ModuleId[]): Promise<void>;
  recordAttempt(input: AttemptInput): Promise<Attempt>;
}

export type SessionUser = { email: string | null };

const LOCAL_KEY = "thinkceo:progress:v1";

function readLocal(): Progress {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? { ...emptyProgress(), ...JSON.parse(raw) } : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

function writeLocal(progress: Progress) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(progress));
  } catch {
    // Storage blocked (private mode): progress lives only for this session.
  }
}

export const localStore: ProgressStore = {
  kind: "local",
  async getProgress() {
    return readLocal();
  },
  async saveAssessment(result, path) {
    writeLocal({ ...readLocal(), assessment: result, path });
  },
  async recordAttempt(input) {
    const { progress, attempt } = applyAttempt(readLocal(), input, new Date());
    writeLocal(progress);
    return attempt;
  },
};

function cloudStore(sb: SupabaseClient, userId: string): ProgressStore {
  const store: ProgressStore = {
    kind: "cloud",
    async getProgress() {
      const [profile, assessment, path, attempts] = await Promise.all([
        sb.from("profiles").select("xp, streak, last_active").eq("user_id", userId).maybeSingle(),
        sb
          .from("assessment_results")
          .select("scores, archetype, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        sb.from("learning_paths").select("modules").eq("user_id", userId).maybeSingle(),
        sb
          .from("attempts")
          .select("scenario_id, option_id, score, confidence, xp, created_at")
          .eq("user_id", userId)
          .order("created_at"),
      ]);
      const failed = [profile, assessment, path, attempts].find((r) => r.error);
      if (failed?.error) throw failed.error;

      return {
        assessment: assessment.data
          ? {
              scores: assessment.data.scores,
              archetype: assessment.data.archetype,
              completedAt: assessment.data.created_at,
            }
          : null,
        path: path.data?.modules ?? [],
        attempts: (attempts.data ?? []).map((a) => ({
          scenarioId: a.scenario_id,
          optionId: a.option_id,
          score: a.score,
          confidence: a.confidence,
          xp: a.xp,
          createdAt: a.created_at,
        })),
        xp: profile.data?.xp ?? 0,
        streak: profile.data?.streak ?? 0,
        lastActive: profile.data?.last_active ?? null,
      };
    },
    async saveAssessment(result, path) {
      const results = await Promise.all([
        sb.from("assessment_results").insert({ user_id: userId, scores: result.scores, archetype: result.archetype }),
        sb.from("learning_paths").upsert({ user_id: userId, modules: path, updated_at: new Date().toISOString() }),
        sb.from("profiles").upsert({ user_id: userId, archetype: result.archetype }),
      ]);
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    },
    async recordAttempt(input) {
      const { progress, attempt } = applyAttempt(await store.getProgress(), input, new Date());
      const inserted = await sb.from("attempts").insert({
        user_id: userId,
        scenario_id: attempt.scenarioId,
        option_id: attempt.optionId,
        score: attempt.score,
        confidence: attempt.confidence,
        xp: attempt.xp,
      });
      if (inserted.error) throw inserted.error;
      const profile = await sb.from("profiles").upsert({
        user_id: userId,
        xp: progress.xp,
        streak: progress.streak,
        last_active: progress.lastActive,
      });
      if (profile.error) throw profile.error;
      return attempt;
    },
  };
  return store;
}

/** Signed-in users sync to Supabase; everyone else uses this device's storage. */
export async function getStore(): Promise<{ store: ProgressStore; user: SessionUser | null }> {
  const sb = getSupabase();
  if (!sb) return { store: localStore, user: null };
  const { data } = await sb.auth.getSession();
  const user = data.session?.user;
  if (!user) return { store: localStore, user: null };
  return { store: cloudStore(sb, user.id), user: { email: user.email ?? null } };
}
