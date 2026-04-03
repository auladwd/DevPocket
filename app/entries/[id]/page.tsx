'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Entry } from '@/types';

const TAG_COLORS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300',
];

export default function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [fetching, setFetching] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      const token = await getToken();
      const res = await fetch(`/api/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setEntry(await res.json());
      setFetching(false);
    })();
  }, [user, id, getToken]);

  const handleDelete = async () => {
    if (!confirm('Delete this entry?')) return;
    const token = await getToken();
    await fetch(`/api/entries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push('/dashboard');
  };

  const copyContent = () => {
    if (!entry?.content) return;
    navigator.clipboard.writeText(entry.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || fetching)
    return (
      <div className="flex items-center justify-center py-32">
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
      </div>
    );

  if (!entry)
    return <p className="p-8 text-center text-zinc-400">Entry not found.</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Back */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-indigo-600 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </Link>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-100/50 dark:border-zinc-700/60 dark:bg-zinc-800 dark:shadow-none">
        {/* Header strip */}
        <div className="bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-extrabold leading-snug text-white">
              {entry.title}
            </h1>
            {entry.pinned && (
              <span className="shrink-0 text-lg text-amber-300" title="Pinned">
                📌
              </span>
            )}
          </div>
          {entry.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Content */}
          {entry.content && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Content
                </p>
                <button
                  onClick={copyContent}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>{' '}
                      Copied!
                    </>
                  ) : (
                    <>
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>{' '}
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 font-mono text-sm leading-relaxed text-emerald-300 dark:bg-zinc-900">
                {entry.content}
              </pre>
            </div>
          )}

          {/* URL */}
          {entry.url && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                Link
              </p>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {entry.url}
              </a>
            </div>
          )}

          {/* Password */}
          {entry.password && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                Password
              </p>
              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-600 dark:bg-zinc-700/40">
                <code className="flex-1 font-mono text-sm text-zinc-700 dark:text-zinc-200">
                  {showPassword ? entry.password : '••••••••••••'}
                </code>
                <button
                  onClick={() => setShowPassword(s => !s)}
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="flex flex-wrap gap-4 rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-400 dark:bg-zinc-700/30">
            <span>Created: {new Date(entry.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(entry.updatedAt).toLocaleString()}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Link
              href={`/entries/${id}/edit`}
              className="flex-1 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:opacity-90 dark:shadow-indigo-900/30"
            >
              Edit Entry
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 rounded-xl border-2 border-rose-300 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-900/20"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
