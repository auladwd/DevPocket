'use client';
// Reusable form for creating and editing entries
import { useState } from 'react';
import { EntryFormData } from '@/types';

interface Props {
  initial?: Partial<EntryFormData>;
  onSubmit: (data: EntryFormData) => Promise<void>;
  submitLabel?: string;
}

export default function EntryForm({
  initial = {},
  onSubmit,
  submitLabel = 'Save',
}: Props) {
  const [title, setTitle] = useState(initial.title ?? '');
  const [content, setContent] = useState(initial.content ?? '');
  const [url, setUrl] = useState(initial.url ?? '');
  const [password, setPassword] = useState(initial.password ?? '');
  const [tagInput, setTagInput] = useState((initial.tags ?? []).join(', '));
  const [pinned, setPinned] = useState(initial.pinned ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const tags = tagInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      await onSubmit({ title, content, url, password, tags, pinned });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          className={inputCls}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. AWS CLI login snippet"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Content / Code Snippet
        </label>
        <textarea
          className={`${inputCls} min-h-[140px] font-mono`}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Paste your code, notes, or text here…"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          URL / Link (optional)
        </label>
        <input
          className={inputCls}
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password (optional, stored encrypted)
        </label>
        <input
          className={inputCls}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Leave blank to clear"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Tags (comma-separated)
        </label>
        <input
          className={inputCls}
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          placeholder="aws, snippet, python"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={pinned}
          onChange={e => setPinned(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 accent-indigo-600"
        />
        Pin this entry
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
