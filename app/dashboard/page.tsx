'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import EntryCard from '@/components/EntryCard';
import ExportModal from '@/components/ExportModal';
import { Entry } from '@/types';

export default function DashboardPage() {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  // null = closed, 'json' | 'csv' = open with that format
  const [exportModal, setExportModal] = useState<'json' | 'csv' | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const fetchEntries = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    setFetching(true);
    setEntries([]);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tagFilter) params.set('tag', tagFilter);
    const res = await fetch(`/api/entries?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setEntries(await res.json());
    else setEntries([]);
    setFetching(false);
  }, [getToken, search, tagFilter]);

  useEffect(() => {
    if (!loading && user) fetchEntries();
    else if (!loading && !user) setEntries([]);
  }, [user, loading, fetchEntries]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    const token = await getToken();
    await fetch(`/api/entries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setEntries(prev => prev.filter(e => e._id !== id));
  };

  const handleExport = async (format: 'json' | 'csv') => {
    // Open the selection modal instead of exporting immediately
    setExportModal(format);
  };

  const doExport = async (selectedIds: string[]) => {
    if (!exportModal || selectedIds.length === 0) return;
    setExportModal(null);

    const token = await getToken();
    const params = new URLSearchParams({ format: exportModal });
    params.set('ids', selectedIds.join(','));

    const res = await fetch(`/api/entries/export?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Use the title of the first selected entry as the filename (sanitised)
    const firstEntry = entries.find(e => e._id === selectedIds[0]);
    const baseName = firstEntry
      ? firstEntry.title
          .replace(/[^a-z0-9_\-\s]/gi, '')
          .trim()
          .replace(/\s+/g, '_')
          .slice(0, 60) || 'devpocket-export'
      : 'devpocket-export';
    const filename =
      selectedIds.length === 1
        ? `${baseName}.${exportModal}`
        : `devpocket-export-${selectedIds.length}.${exportModal}`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allTags = Array.from(new Set(entries.flatMap(e => e.tags)));

  if (loading) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Export selection modal */}
      {exportModal && (
        <ExportModal
          entries={entries}
          format={exportModal}
          onClose={() => setExportModal(null)}
          onExport={doExport}
        />
      )}
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            My Entries
          </h1>
          <p className="mt-0.5 text-sm text-zinc-400 dark:text-zinc-500">
            {entries.length > 0
              ? `${entries.length} item${entries.length > 1 ? 's' : ''} saved`
              : 'Nothing saved yet'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport('json')}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            title={`Export ${entries.length} visible entr${entries.length === 1 ? 'y' : 'ies'} as JSON`}
          >
            <svg
              className="h-3.5 w-3.5"
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
            JSON{' '}
            {entries.length > 0 && (
              <span className="ml-0.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                {entries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            title={`Export ${entries.length} visible entr${entries.length === 1 ? 'y' : 'ies'} as CSV`}
          >
            <svg
              className="h-3.5 w-3.5"
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
            CSV{' '}
            {entries.length > 0 && (
              <span className="ml-0.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                {entries.length}
              </span>
            )}
          </button>
          <Link
            href="/entries/new"
            className="flex items-center gap-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:opacity-90 dark:shadow-indigo-900/30"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Entry
          </Link>
        </div>
      </div>

      {/* Search & filter bar */}
      <div className="mb-7 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-900/40"
            placeholder="Search by title or content…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-indigo-400 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
        >
          <option value="">All tags</option>
          {allTags.map(t => (
            <option key={t} value={t}>
              #{t}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {fetching ? (
        <div className="flex flex-col items-center gap-3 py-24 text-zinc-400">
          <svg
            className="h-8 w-8 animate-spin text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <span className="text-sm">Loading your entries…</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-zinc-300 py-24 text-center dark:border-zinc-600">
          <span className="text-6xl">📭</span>
          <div>
            <p className="font-semibold text-zinc-600 dark:text-zinc-300">
              No entries yet
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Create your first entry to get started.
            </p>
          </div>
          <Link
            href="/entries/new"
            className="rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90"
          >
            + New Entry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(entry => (
            <EntryCard key={entry._id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
