"use client";

import { useState, type FormEvent } from "react";
import { cleanDisplayName, MAX_NAME_LENGTH } from "@/lib/progress";
import { Icon } from "./Icon";
import { useProgress } from "./ProgressProvider";
import { btnPrimary } from "./ui";

/** Name input shared by the sign-up prompt and the Profile page. */
export function NameForm({ initial = "", submitLabel, onSaved }: { initial?: string; submitLabel: string; onSaved?(): void }) {
  const { saveDisplayName } = useProgress();
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const name = cleanDisplayName(value);
    if (!name) {
      setError(`Enter a name up to ${MAX_NAME_LENGTH} characters.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await saveDisplayName(name);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your name");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={MAX_NAME_LENGTH}
        autoComplete="name"
        placeholder="Your name"
        aria-label="Your name"
        className="w-full rounded-2xl bg-violet-50 px-4 py-4 font-semibold outline-none ring-2 ring-transparent focus:ring-violet-400"
      />
      <button type="submit" disabled={busy} className={btnPrimary}>
        {busy ? <Icon name="loader" className="h-5 w-5 animate-spin" /> : <Icon name="check" />} {submitLabel}
      </button>
      {error && <p className="text-sm font-semibold text-orange-600">{error}</p>}
    </form>
  );
}
