const btnBase =
  "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-bold transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-40";

export const btnPrimary = `${btnBase} bg-linear-to-r from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-300/50`;
export const btnAccent = `${btnBase} bg-linear-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-300/50`;
export const btnGhost = `${btnBase} bg-white text-violet-700 ring-1 ring-violet-200`;

export const card = "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-violet-100";
export const chip = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold";
