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

const ACCENT_BORDERS = [
  'border-t-indigo-400',
  'border-t-emerald-400',
  'border-t-violet-400',
  'border-t-sky-400',
  'border-t-rose-400',
  'border-t-amber-400',
];

export default function EntryCard({ entry, onDelete }: Props) {
  const accentIdx = (entry.title.charCodeAt(0) ?? 0) % ACCENT_BORDERS.length;

  return (
    <div
      className={`relative flex h-64 flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-700/60 dark:bg-zinc-800/90 border-t-4 ${ACCENT_BORDERS[accentIdx]}`}
    >
      {/* Pin badge */}
      {entry.pinned && (
        <span
          className="absolute right-3 top-3 text-sm text-amber-400 drop-shadow"
          title="Pinned"
        >
          📌
        </span>
      )}

      {/* ── Body (scrollable area, fills remaining space) ── */}
      <div className="flex flex-1 flex-col gap-2 overflow-hidden px-4 pt-4 pb-2">
        {/* Title — max 2 lines */}
        <Link
          href={`/entries/${entry._id}`}
          className="line-clamp-2 pr-5 text-sm font-bold leading-snug text-zinc-800 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
        >
          {entry.title}
        </Link>

        {/* Content preview — always exactly 3 lines */}
        <div className="h-25 shrink-0">
          {entry.content ? (
            <pre className="h-full overflow-hidden rounded-lg bg-zinc-50 px-2.5 py-2 font-mono text-xs leading-6 text-zinc-500 dark:bg-zinc-900/70 dark:text-zinc-400 line-clamp-3 whitespace-pre-wrap break-all">
              {entry.content}
            </pre>
          ) : (
            <div className="h-full rounded-lg bg-zinc-50 dark:bg-zinc-900/40" />
          )}
        </div>

        {/* URL — always 1 line, truncated */}
        <div className="h-4 shrink-0">
          {entry.url ? (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 truncate text-xs text-indigo-500 hover:text-indigo-700 hover:underline dark:text-indigo-400"
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
          ) : null}
        </div>

        {/* Tags — always 1 line, overflow hidden */}
        <div className="h-5 shrink-0 overflow-hidden">
          {entry.tags.length > 0 && (
            <div className="flex gap-1.5 overflow-hidden">
              {entry.tags.slice(0, 4).map((tag, i) => (
                <span
                  key={tag}
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  #{tag}
                </span>
              ))}
              {entry.tags.length > 4 && (
                <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500">
                  +{entry.tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer — always pinned to bottom ── */}
      <div className="flex shrink-0 items-center justify-between border-t border-zinc-100 px-4 py-2.5 dark:border-zinc-700/50">
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
