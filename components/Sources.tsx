import type { Reference } from "@/lib/learn";
import { Icon } from "./Icon";
import { card } from "./ui";

export function Sources({ references, factsAsOf }: { references: Reference[]; factsAsOf?: string }) {
  if (!references.length) return null;
  return (
    <div className={`${card} mt-4 p-4`}>
      <p className="flex items-center gap-2 font-extrabold">
        <Icon name="book" className="h-4 w-4 text-violet-500" /> Sources
      </p>
      {factsAsOf && (
        <p className="mt-1 text-xs text-violet-900/60">
          Facts checked {factsAsOf}. Tax and legal rules change, so confirm with the official source or a professional.
        </p>
      )}
      <ul className="mt-3 space-y-2">
        {references.map((ref) => (
          <li key={ref.url}>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-violet-50 px-3 py-2 text-sm hover:bg-violet-100"
            >
              <span className="font-bold text-violet-700">{ref.title}</span>
              <span className="block text-xs text-violet-900/60">{ref.publisher}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
