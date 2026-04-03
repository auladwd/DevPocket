'use client';
import { useState } from 'react';
import { Entry } from '@/types';

interface Props {
  entries: Entry[];
  format: 'json' | 'csv';
  onClose: () => void;
  onExport: (selectedIds: string[]) => void;
}

export default function ExportModal({
  entries,
  format,
  onClose,
  onExport,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    // Start with all entries selected
    new Set(entries.map(e => e._id!).filter(Boolean)),
  );

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === entries.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(entries.map(e => e._id!).filter(Boolean)));
    }
  };

  const allChecked = selected.size === entries.length;
  const someChecked = selected.size > 0 && selected.size < entries.length;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-md flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-700">
          <div className="flex items-center gap-2.5">
            <span
              className={`rounded-lg px-2 py-0.5 text-xs font-bold uppercase tracking-widest ${format === 'json' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'}`}
            >
              {format}
            </span>
            <h2 className="font-bold text-zinc-800 dark:text-zinc-100">
              Select entries to export
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Select all row */}
        <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-700">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={allChecked}
              ref={el => {
                if (el) el.indeterminate = someChecked;
              }}
              onChange={toggleAll}
              className="h-4 w-4 rounded border-zinc-300 accent-indigo-600"
            />
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Select all
            </span>
            <span className="ml-auto text-xs text-zinc-400">
              {selected.size} / {entries.length} selected
            </span>
          </label>
        </div>

        {/* Entry list */}
        <div className="max-h-72 overflow-y-auto">
          {entries.map(entry => (
            <label
              key={entry._id}
              className="flex cursor-pointer items-center gap-3 border-b border-zinc-50 px-5 py-3 transition hover:bg-zinc-50 dark:border-zinc-700/50 dark:hover:bg-zinc-700/40"
            >
              <input
                type="checkbox"
                checked={selected.has(entry._id!)}
                onChange={() => toggleOne(entry._id!)}
                className="h-4 w-4 shrink-0 rounded border-zinc-300 accent-indigo-600"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  {entry.title}
                </p>
                {entry.tags.length > 0 && (
                  <p className="mt-0.5 truncate text-xs text-zinc-400">
                    {entry.tags.map(t => `#${t}`).join(' · ')}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-xs text-zinc-300 dark:text-zinc-600">
                {new Date(entry.updatedAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </label>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            disabled={selected.size === 0}
            onClick={() => onExport(Array.from(selected))}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:shadow-indigo-900/30"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export {selected.size} {selected.size === 1 ? 'entry' : 'entries'}
          </button>
        </div>
      </div>
    </div>
  );
}
