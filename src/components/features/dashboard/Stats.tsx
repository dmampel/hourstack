'use client';

import { Clock, DollarSign, CalendarDays, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import { exportSessionsToCSV } from '@/lib/csv';
import { isToday, isThisWeek } from 'date-fns';
import Button from '@/components/ui/Button';

interface ChipCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentVar: string;
}

function ChipCard({ label, value, icon, accentVar }: ChipCardProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-soft)]"
      style={{
        background: `color-mix(in srgb, ${accentVar} 12%, var(--color-surface))`,
      }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)]"
        style={{
          background: `color-mix(in srgb, ${accentVar} 20%, var(--color-surface))`,
          color: accentVar,
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]">
          {label}
        </p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--color-ink)] leading-tight">

          {value}
        </p>
      </div>
    </div>
  );
}

export default function Stats() {
  const projects = useAppStore((state) => state.projects);
  const sessions = useAppStore((state) => state.sessions);

  const totalSecondsToday = sessions
    .filter((s) => isToday(new Date(s.startTime)))
    .reduce((sum, s) => sum + s.duration, 0);

  const totalSecondsWeek = sessions
    .filter((s) => isThisWeek(new Date(s.startTime), { weekStartsOn: 1 }))
    .reduce((sum, s) => sum + s.duration, 0);

  const totalEarningsToday = sessions
    .filter((s) => isToday(new Date(s.startTime)))
    .reduce((sum, s) => sum + s.earnings, 0);

  const totalEarningsWeek = sessions
    .filter((s) => isThisWeek(new Date(s.startTime), { weekStartsOn: 1 }))
    .reduce((sum, s) => sum + s.earnings, 0);

  const totalPaidUSD = sessions.reduce((sum, s) => {
    const p = projects.find((proj) => proj.id === s.projectId);
    return p?.currency === 'USD' && s.isPaid ? sum + s.earnings : sum;
  }, 0);

  const totalPendingUSD = sessions.reduce((sum, s) => {
    const p = projects.find((proj) => proj.id === s.projectId);
    return p?.currency === 'USD' && !s.isPaid ? sum + s.earnings : sum;
  }, 0);

  const totalPaidARS = sessions.reduce((sum, s) => {
    const p = projects.find((proj) => proj.id === s.projectId);
    return p?.currency === 'ARS' && s.isPaid ? sum + s.earnings : sum;
  }, 0);

  const totalPendingARS = sessions.reduce((sum, s) => {
    const p = projects.find((proj) => proj.id === s.projectId);
    return p?.currency === 'ARS' && !s.isPaid ? sum + s.earnings : sum;
  }, 0);

  const projectStats = projects
    .map((project) => {
      const projectSessions = sessions.filter((s) => s.projectId === project.id);
      const totalSeconds = projectSessions.reduce((sum, s) => sum + s.duration, 0);
      const earnings = projectSessions.reduce((sum, s) => sum + s.earnings, 0);
      return { project, totalSeconds, earnings, sessionCount: projectSessions.length };
    })
    .filter((ps) => ps.sessionCount > 0);

  const handleExport = () => {
    exportSessionsToCSV(sessions, projects);
  };

  return (
    <div className="space-y-8">
      {/* 4-chip summary grid */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[var(--text-h2)] font-semibold text-[var(--color-ink)]">
            Summary
          </h2>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ChipCard
            label="Today"
            value={formatDuration(totalSecondsToday)}
            icon={<Clock size={18} />}
            accentVar="var(--color-grape)"
          />
          <ChipCard
            label="Today Earned"
            value={formatCurrency(totalEarningsToday, 'USD')}
            icon={<DollarSign size={18} />}
            accentVar="var(--color-tangerine)"
          />
          <ChipCard
            label="This Week"
            value={formatDuration(totalSecondsWeek)}
            icon={<CalendarDays size={18} />}
            accentVar="var(--color-lime)"
          />
          <ChipCard
            label="Week Earned"
            value={formatCurrency(totalEarningsWeek, 'USD')}
            icon={<TrendingUp size={18} />}
            accentVar="var(--color-sky)"
          />
        </div>
      </div>

      {/* Earnings breakdown */}
      <div>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
          Earnings Overview
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <EarningsCard label="US Dollars" currency="USD" paid={totalPaidUSD} pending={totalPendingUSD} />
          <EarningsCard label="Argentine Pesos" currency="ARS" paid={totalPaidARS} pending={totalPendingARS} />
        </div>
      </div>

      {/* Per-project breakdown */}
      {projectStats.length > 0 && (
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
            By Project
          </h3>
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-line)] bg-[var(--color-surface-muted)]">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Project</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Client</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Sessions</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Total Hours</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {projectStats.map(({ project, totalSeconds, earnings, sessionCount }) => (
                  <tr key={project.id} className="transition-colors hover:bg-[var(--color-surface-muted)]">
                    <td className="px-5 py-3.5 font-medium text-[var(--color-ink)]">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ backgroundColor: project.color || 'var(--color-grape)' }}
                        />
                        {project.name}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--color-ink-soft)]">{project.client || '—'}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-[var(--color-ink-soft)]">{sessionCount}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-[var(--color-ink)]">{formatDuration(totalSeconds)}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-[var(--color-grape)]">
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
        <p className="text-sm text-[var(--color-ink-soft)]">
          No sessions yet. Start the timer to see your stats here.
        </p>
      )}
    </div>
  );
}

function EarningsCard({
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
    <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
      <div className="border-b border-[var(--color-line)] bg-[var(--color-surface-muted)] px-5 py-3">
        <p className="text-xs font-bold text-[var(--color-ink-soft)]">{label}</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-[var(--color-line)]">
        <div className="px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-lime)]" style={{ color: 'color-mix(in srgb, var(--color-lime) 70%, #1B1A22)' }}>Paid</p>
          <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: 'color-mix(in srgb, var(--color-lime) 70%, #1B1A22)' }}>
            {formatCurrency(paid, currency)}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-tangerine)]">Pending</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-tangerine)]">
            {formatCurrency(pending, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
