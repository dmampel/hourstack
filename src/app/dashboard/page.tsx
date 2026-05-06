'use client';

import SessionList from '@/components/features/sessions/SessionList';
import Stats from '@/components/features/dashboard/Stats';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] font-semibold text-[var(--color-ink)]" style={{ fontSize: 'var(--text-h1)' }}>
          Welcome back, Delfina! 👋
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Here&apos;s your time tracking overview</p>
      </div>

      {/* Sessions — full width */}
      <SessionList />

      {/* Stats summary + earnings */}
      <Stats />
    </div>
  );
}
