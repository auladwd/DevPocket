'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import EntryForm from '@/components/EntryForm';
import { Entry, EntryFormData } from '@/types';

export default function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [fetching, setFetching] = useState(true);
  const [id, setId] = useState<string>('');

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

  const handleSubmit = async (data: EntryFormData) => {
    const token = await getToken();
    const res = await fetch(`/api/entries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'Failed to update entry');
    }
    router.push(`/entries/${id}`);
  };

  if (loading || fetching) return null;
  if (!entry)
    return <p className="p-8 text-center text-zinc-400">Entry not found.</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href={`/entries/${id}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-indigo-600"
      >
        ← Back to Entry
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Edit Entry</h1>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <EntryForm
          initial={{
            title: entry.title,
            content: entry.content,
            url: entry.url,
            password: entry.password, // already decrypted by GET /api/entries/[id]
            tags: entry.tags,
            pinned: entry.pinned,
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Entry"
        />
      </div>
    </div>
  );
}
