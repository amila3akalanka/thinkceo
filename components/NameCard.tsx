"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { NameForm } from "./NameForm";
import { useProgress } from "./ProgressProvider";
import { card } from "./ui";

export function NameCard() {
  const { progress } = useProgress();
  const [editing, setEditing] = useState(false);
  const name = progress?.displayName;

  return (
    <div className={`${card} mb-4`}>
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-orange-300 to-orange-500 text-xl font-extrabold text-white">
          {name ? name[0].toUpperCase() : <Icon name="user" className="h-6 w-6" />}
        </span>
        <div className="flex-1">
          <p className="text-xs font-bold text-violet-400 uppercase">Your name</p>
          <p className="text-xl font-extrabold">{name ?? "Not set yet"}</p>
        </div>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="text-sm font-bold text-violet-600">
            {name ? "Edit" : "Add"}
          </button>
        )}
      </div>
      {editing && (
        <div className="mt-4">
          <NameForm initial={name ?? ""} submitLabel="Save name" onSaved={() => setEditing(false)} />
          <button type="button" onClick={() => setEditing(false)} className="mt-2 w-full text-sm font-bold text-violet-400">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
