'use client';

import SummaryGrid from './SummaryGrid';
import EarningsOverview from './EarningsOverview';
import ProjectTable from './ProjectTable';
import { useAppStore } from '@/store/useAppStore';

export default function Stats() {
  const sessions = useAppStore((state) => state.sessions);

  if (sessions.length === 0) {
    return (
      <p className="text-sm text-[var(--color-ink-soft)]">
        No sessions yet. Start the timer to see your stats here.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <SummaryGrid />
      <EarningsOverview />
      <ProjectTable />
    </div>
  );
}

export { SummaryGrid, EarningsOverview, ProjectTable };
