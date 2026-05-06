'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import SessionList from '@/components/features/sessions/SessionList';
import { ResourcesSection } from '@/components/features/projects/ResourcesSection';
import Card from '@/components/ui/Card';
import Badge, { currencyTone } from '@/components/ui/Badge';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const projects = useAppStore((state) => state.projects);
  const sessions = useAppStore((state) => state.sessions);

  const project = projects.find((p) => p.id === id);
  const projectSessions = useMemo(() => sessions.filter((s) => s.projectId === id), [sessions, id]);

  const totalDuration = useMemo(() => projectSessions.reduce((sum, s) => sum + s.duration, 0), [projectSessions]);
  const totalPaid = useMemo(() => projectSessions.filter((s) => s.isPaid).reduce((sum, s) => sum + s.earnings, 0), [projectSessions]);
  const totalPending = useMemo(() => projectSessions.filter((s) => !s.isPaid).reduce((sum, s) => sum + s.earnings, 0), [projectSessions]);

  if (!project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[var(--color-ink)]">
          Project not found
        </h1>
        <Link href="/dashboard" className="mt-4 text-[var(--color-grape)] hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const projectColor = project.color || '#7C5CFF';

  return (
    <div className="space-y-8">
      {/* Hero strip */}
      <div
        className="rounded-[var(--radius-xl)] px-8 py-8"
        style={{
          background: `color-mix(in srgb, ${projectColor} 14%, var(--color-surface))`,
        }}
      >
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-grape)]"
        >
          <ChevronLeft size={14} />
          Back to Projects
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: projectColor }}
                aria-hidden="true"
              />
              <h1 className="font-[family-name:var(--font-fraunces)] text-[var(--text-h1)] font-semibold text-[var(--color-ink)]">
                {project.name}
              </h1>
            </div>
            <p className="text-sm text-[var(--color-ink-soft)]">{project.client || 'Internal Project'}</p>
          </div>

          <Badge tone={currencyTone(project.currency)} className="text-sm px-4 py-1.5">
            {formatCurrency(project.hourlyRate, project.currency)}/hr
          </Badge>
        </div>

        {/* Project stat chips inside hero */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] bg-white/50 px-5 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">Total Time</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-[var(--color-ink)]">{formatDuration(totalDuration)}</p>
          </div>
          <div className="rounded-[var(--radius-md)] px-5 py-3" style={{ background: `color-mix(in srgb, var(--color-lime) 25%, white)` }}>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-lime) 70%, #1B1A22)' }}>Paid</p>
            <p className="mt-1 text-xl font-bold tabular-nums" style={{ color: 'color-mix(in srgb, var(--color-lime) 70%, #1B1A22)' }}>{formatCurrency(totalPaid, project.currency)}</p>
          </div>
          <div className="rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-tangerine)_15%,white)] px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-tangerine)]">Pending</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-[var(--color-tangerine)]">{formatCurrency(totalPending, project.currency)}</p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sessions — main column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
              Session History
            </h2>
            <span className="text-xs text-[var(--color-ink-soft)]">{projectSessions.length} sessions total</span>
          </div>
          <SessionList projectId={id} />
        </div>

        {/* Sidebar: Resources + Settings */}
        <div className="space-y-6">
          <ResourcesSection projectId={id} resources={project.resources || []} />

          <Card padding="md">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Settings</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">Hourly Rate</p>
                <p className="font-bold text-[var(--color-ink)]">{formatCurrency(project.hourlyRate, project.currency)} / hr</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">Currency</p>
                <p className="font-bold text-[var(--color-ink)]">{project.currency}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
