'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import EntryForm from '@/components/EntryForm';
import { EntryFormData } from '@/types';

export default function NewEntryPage() {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const handleSubmit = async (data: EntryFormData) => {
    const token = await getToken();
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'Failed to create entry');
    }
    router.push('/dashboard');
  };

  if (loading) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">New Entry</h1>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <EntryForm onSubmit={handleSubmit} submitLabel="Create Entry" />
      </div>
    </div>
  );
}
