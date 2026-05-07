'use client';

import { useAppStore } from '@/store/useAppStore';
import Button from '@/components/ui/Button';
import SessionList from '@/components/features/sessions/SessionList';
import { SummaryGrid, EarningsOverview, ProjectTable } from '@/components/features/dashboard/Stats';

export default function DashboardPage() {
  const sessions = useAppStore((state) => state.sessions);
  const projects = useAppStore((state) => state.projects);

  const handleExport = () => {
    import('@/lib/csv').then(({ exportSessionsToCSV }) => {
      exportSessionsToCSV(sessions, projects);
    });
  };

  const name = useAppStore((state) => state.settings.name);

  return (
    <div className="space-y-6 pb-10">
      {/* Greeting & Actions */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-fraunces)] font-semibold text-[var(--color-ink)]">
            Welcome back, {name}! 👋
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">7 de mayo de 2026</p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Export CSV
          </Button>
          <Button variant="secondary" size="sm" className="opacity-50 cursor-not-allowed">
            Generate Report
          </Button>
        </div>
      </div>

      {/* 1. Summary Chips - Top prominence */}
      <SummaryGrid />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Sessions (2/3) */}
        <div className="lg:col-span-2">
          <SessionList limit={4} />
        </div>

        {/* Right Column: Financials & More (1/3) */}
        <div className="flex flex-col gap-6">
          <EarningsOverview />
        </div>
      </div>

      {/* Bottom Section: Full-width Project Table */}
      <div className="mt-6">
        <ProjectTable />
      </div>
    </div>
  );
}
