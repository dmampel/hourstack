'use client';

import Timer from '@/components/features/sessions/Timer';
import SessionList from '@/components/features/sessions/SessionList';
import Stats from '@/components/features/dashboard/Stats';

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>

      {/* Timer + Sessions */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Timer />
        <SessionList />
      </div>

      {/* Stats */}
      <Stats />
    </main>
  );
}
