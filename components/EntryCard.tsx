'use client';
import Link from 'next/link';
import { Entry } from '@/types';

interface Props {
  entry: Entry;
  onDelete: (id: string) => void;
}

const TAG_COLORS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
];

// Pick a subtle top-border accent color per entry based on title char
const ACCENT_BORDERS = [
  'border-t-indigo-400',
  'border-t-emerald-400',
  'border-t-violet-400',
  'border-t-sky-400',
  'border-t-rose-400',
  'border-t-amber-400',
];

export default function EntryCard({ entry, onDelete }: Props) {
  const preview =
    entry.content.slice(0, 100) + (entry.content.length > 100 ? '…' : '');
  const accentIdx = (entry.title.charCodeAt(0) ?? 0) % ACCENT_BORDERS.length;

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-700/60 dark:bg-zinc-800/90 border-t-4 ${ACCENT_BORDERS[accentIdx]}`}
    >
      {/* Pin badge */}
      {entry.pinned && (
        <span
          className="absolute right-4 top-3.5 text-sm text-amber-400 drop-shadow"
          title="Pinned"
        >
          📌
        </span>
      )}

      {/* Title */}
      <Link
        href={`/entries/${entry._id}`}
        className="pr-6 text-base font-bold leading-snug text-zinc-800 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
      >
        {entry.title}
      </Link>

      {/* Content preview */}
      {preview && (
        <pre className="overflow-hidden rounded-lg bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-500 dark:bg-zinc-900/70 dark:text-zinc-400">
          {preview}
        </pre>
      )}

      {/* URL */}
      {entry.url && (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 truncate text-xs text-indigo-500 hover:text-indigo-700 hover:underline dark:text-indigo-400"
        >
          <svg
            className="h-3 w-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <span className="truncate">{entry.url}</span>
        </a>
      )}

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag, i) => (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${TAG_COLORS[i % TAG_COLORS.length]}`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: date + actions */}
      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-700/50">
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {new Date(entry.updatedAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/entries/${entry._id}`}
            className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/70"
          >
            View
          </Link>
          <Link
            href={`/entries/${entry._id}/edit`}
            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/70"
          >
            Edit
          </Link>
          <button
            onClick={() => entry._id && onDelete(entry._id)}
            className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/70"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
