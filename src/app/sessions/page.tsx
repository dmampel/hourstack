'use client';

import SessionList from '@/components/features/sessions/SessionList';

export default function SessionsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <h1 className="font-[family-name:var(--font-fraunces)] font-semibold text-[var(--color-ink)]">
          All Sessions
        </h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">
          Review and manage your full activity history.
        </p>
      </header>

      <SessionList />
    </div>
  );
}
