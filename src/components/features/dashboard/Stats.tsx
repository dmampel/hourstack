'use client';

import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import { exportSessionsToCSV } from '@/lib/csv';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';

export default function Stats() {
  const projects = useAppStore((state) => state.projects);
  const sessions = useAppStore((state) => state.sessions);

  // --- Global summary ---
  const totalSecondsToday = sessions
    .filter((s) => isToday(new Date(s.startTime)))
    .reduce((sum, s) => sum + s.duration, 0);

  const totalSecondsWeek = sessions
    .filter((s) => isThisWeek(new Date(s.startTime), { weekStartsOn: 1 }))
    .reduce((sum, s) => sum + s.duration, 0);

  const totalSecondsMonth = sessions
    .filter((s) => isThisMonth(new Date(s.startTime)))
    .reduce((sum, s) => sum + s.duration, 0);

  const totalPaidUSD = sessions.reduce((sum, s) => {
    const p = projects.find((proj) => proj.id === s.projectId);
    return (p?.currency === 'USD' && s.isPaid) ? sum + s.earnings : sum;
  }, 0);

  const totalPendingUSD = sessions.reduce((sum, s) => {
    const p = projects.find((proj) => proj.id === s.projectId);
    return (p?.currency === 'USD' && !s.isPaid) ? sum + s.earnings : sum;
  }, 0);

  const totalPaidARS = sessions.reduce((sum, s) => {
    const p = projects.find((proj) => proj.id === s.projectId);
    return (p?.currency === 'ARS' && s.isPaid) ? sum + s.earnings : sum;
  }, 0);

  const totalPendingARS = sessions.reduce((sum, s) => {
    const p = projects.find((proj) => proj.id === s.projectId);
    return (p?.currency === 'ARS' && !s.isPaid) ? sum + s.earnings : sum;
  }, 0);

  // --- Per-project breakdown ---
  const projectStats = projects.map((project) => {
    const projectSessions = sessions.filter((s) => s.projectId === project.id);
    const totalSeconds = projectSessions.reduce((sum, s) => sum + s.duration, 0);
    const earnings = projectSessions.reduce((sum, s) => sum + s.earnings, 0);
    return { project, totalSeconds, earnings, sessionCount: projectSessions.length };
  }).filter((ps) => ps.sessionCount > 0);

  const handleExport = () => {
    exportSessionsToCSV(sessions, projects);
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-zinc-800">Summary</h2>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
              <path d="M3.5 12.75a.75.75 0 0 0-1.5 0V15A2.5 2.5 0 0 0 4.5 17.5h11A2.5 2.5 0 0 0 18 15v-2.25a.75.75 0 0 0-1.5 0V15a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-2.25Z" />
            </svg>
            Export CSV
          </button>
        </div>

        <div className="space-y-6">
          {/* Time Tracking Section */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Time Tracking
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Today" value={formatDuration(totalSecondsToday)} />
              <StatCard label="This Week" value={formatDuration(totalSecondsWeek)} />
              <StatCard label="This Month" value={formatDuration(totalSecondsMonth)} />
            </div>
          </div>

          {/* Financial Summary Section */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Earnings Overview
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CurrencyCard
                label="US Dollars"
                currency="USD"
                paid={totalPaidUSD}
                pending={totalPendingUSD}
              />
              <CurrencyCard
                label="Argentine Pesos"
                currency="ARS"
                paid={totalPaidARS}
                pending={totalPendingARS}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Per-project breakdown */}
      {projectStats.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-800">By Project</h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Project
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Client
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Sessions
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Total Hours
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {projectStats.map(({ project, totalSeconds, earnings, sessionCount }) => (
                  <tr key={project.id} className="hover:bg-zinc-50">
                    <td className="px-5 py-3.5 font-medium text-zinc-800">{project.name}</td>
                    <td className="px-5 py-3.5 text-zinc-500">{project.client || '—'}</td>
                    <td className="px-5 py-3.5 text-right text-zinc-500">{sessionCount}</td>
                    <td className="px-5 py-3.5 text-right text-zinc-700">
                      {formatDuration(totalSeconds)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">
                      {formatCurrency(earnings, project.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <p className="text-sm text-zinc-400">
          No sessions yet. Start the timer to see your stats here.
        </p>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 tabular-nums">
        {value}
      </p>
    </div>
  );
}

function CurrencyCard({
  label,
  currency,
  paid,
  pending,
}: {
  label: string;
  currency: 'ARS' | 'USD';
  paid: number;
  pending: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="border-b border-zinc-50 bg-zinc-50/30 px-5 py-3">
        <p className="text-xs font-bold text-zinc-500">{label}</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-zinc-50">
        <div className="px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            Paid
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
            {formatCurrency(paid, currency)}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
            Pending
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-700 tabular-nums">
            {formatCurrency(pending, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
