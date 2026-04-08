'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const features = [
  {
    icon: '🔐',
    title: 'Encrypted Storage',
    desc: 'Passwords are AES-256 encrypted before hitting the database.',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    icon: '🔍',
    title: 'Search & Filter',
    desc: 'Find any entry instantly by title, content, or tag.',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
  },
  {
    icon: '📦',
    title: 'Export Anytime',
    desc: 'Download all your data as JSON or CSV whenever you need.',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: '📌',
    title: 'Pin & Organise',
    desc: 'Pin important entries to the top and tag everything.',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If user is already logged in, send them straight to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // While Firebase is resolving auth state, show nothing to avoid flash
  if (loading || user) return null;

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-28 text-center">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/30" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/20" />

        <span className="mb-4 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400">
          Your Personal Dev Vault
        </span>

        <h1 className="mb-5 text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
          Dev
          <span className="bg-linear-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Pocket
          </span>
        </h1>

        <p className="mb-10 max-w-lg text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
          Store code snippets, passwords, links, and notes — all encrypted,
          organised, and always within reach.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:opacity-90 hover:shadow-indigo-300 dark:shadow-indigo-900/40"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-zinc-300 bg-white px-8 py-3 font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-10 text-center text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Everything you need
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(f => (
              <div
                key={f.title}
                className={`rounded-2xl border border-zinc-200/80 ${f.bg} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-700/50`}
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-1.5 font-bold text-zinc-800 dark:text-zinc-100">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
