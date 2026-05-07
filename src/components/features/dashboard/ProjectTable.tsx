'use client';

import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';

export default function ProjectTable() {
  const projects = useAppStore((state) => state.projects);
  const sessions = useAppStore((state) => state.sessions);

  const projectStats = projects
    .map((project) => {
      const projectSessions = sessions.filter((s) => s.projectId === project.id);
      const totalSeconds = projectSessions.reduce((sum, s) => sum + s.duration, 0);
      const earnings = projectSessions.reduce((sum, s) => sum + s.earnings, 0);
      return { project, totalSeconds, earnings, sessionCount: projectSessions.length };
    })
    .filter((ps) => ps.sessionCount > 0);

  if (projectStats.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
        By Project
      </h3>
      <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)] bg-[var(--color-surface-muted)]">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Project</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)] sm:table-cell">Client</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Hours</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {projectStats.map(({ project, totalSeconds, earnings }) => (
                <tr key={project.id} className="transition-colors hover:bg-[var(--color-surface-muted)]">
                  <td className="px-5 py-3.5 font-medium text-[var(--color-ink)]">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: project.color || 'var(--color-grape)' }}
                      />
                      <span className="truncate max-w-[120px]">{project.name}</span>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-[var(--color-ink-soft)] sm:table-cell truncate max-w-[100px]">{project.client || '—'}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-[var(--color-ink-soft)] whitespace-nowrap">{formatDuration(totalSeconds)}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-[var(--color-grape)] whitespace-nowrap">
                    {formatCurrency(earnings, project.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
