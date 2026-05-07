'use client';

import { useParams, useRouter } from 'next/navigation';
import { Clock, DollarSign, BarChart3, ArrowLeft, Pencil } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import SessionList from '@/components/features/sessions/SessionList';
import ProjectResources from '@/components/features/projects/ProjectResources';
import Button from '@/components/ui/Button';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const project = useAppStore(useShallow((state) => state.projects.find((p) => p.id === id)));
  const sessions = useAppStore(useShallow((state) => state.sessions.filter((s) => s.projectId === id)));

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-[var(--color-ink)]">Project not found</p>
        <Button variant="secondary" size="md" className="mt-4" onClick={() => router.push('/projects')}>
          <ArrowLeft size={16} /> Back to Projects
        </Button>
      </div>
    );
  }

  // Stats
  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalEarnings = sessions.reduce((sum, s) => sum + s.earnings, 0);
  const avgSessionSeconds = sessions.length > 0 ? Math.floor(totalSeconds / sessions.length) : 0;

  const accentColor = project.color || 'var(--color-grape)';
  const headerBg = `color-mix(in srgb, ${accentColor} 8%, var(--color-canvas))`;

  return (
    <div>
      {/* Hero wrapper — relative so the dropdown can position against its bottom edge */}
      <div className="relative">

        {/* Hero — full width */}
        <div
          className="relative overflow-hidden px-6 pb-16 pt-10 md:px-12 lg:px-16"
          style={{ background: headerBg }}
        >
          {/* Back + title + client/rate */}
          <div className="relative z-10 space-y-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div>
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                <h1 className="font-[family-name:var(--font-fraunces)] text-[var(--text-h1)] font-semibold text-[var(--color-ink)]">
                  {project.name}
                </h1>
              </div>
              <p className="mt-2 flex items-center gap-3 text-xs tracking-wide">
                <span className="text-[var(--color-ink-soft)]">Client</span>
                <span className="font-semibold text-[var(--color-ink)]">{project.client || 'Internal'}</span>
                <span className="h-3 w-px bg-[var(--color-line)]" />
                <span className="text-[var(--color-ink-soft)]">Rate</span>
                <span className="font-bold tabular-nums" style={{ color: accentColor }}>
                  {formatCurrency(project.hourlyRate, project.currency)}/hr
                </span>
              </p>
            </div>
          </div>

          {/* Edit — top right */}
          <button
            onClick={() => router.push('/projects')}
            className="absolute right-6 top-6 z-10 flex items-center gap-1.5 rounded-full border border-white/50 bg-white/40 px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)] backdrop-blur-sm transition-all hover:bg-white/70"
          >
            <Pencil size={11} />
            Edit
          </button>

          {/* Decorative blur */}
          <div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[80px] opacity-20"
            style={{ background: accentColor }}
          />
        </div>

        {/* Glass metadata card — small, right-aligned, straddling hero bottom */}
        <div className="absolute bottom-0 right-12 z-30 hidden translate-y-1/2 lg:block">
          <div className="flex items-stretch divide-x divide-[var(--color-line)]/30 overflow-hidden rounded-xl border border-white/50 bg-white/70 shadow-lg backdrop-blur-lg">
            <div className="px-4 py-2.5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Created</p>
              <p className="mt-0.5 whitespace-nowrap text-xs font-semibold text-[var(--color-ink)]">
                {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="px-4 py-2.5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Sessions</p>
              <p className="mt-0.5 text-xs font-semibold text-[var(--color-ink)]">{sessions.length}</p>
            </div>
            <div className="px-4 py-2.5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Currency</p>
              <p className="mt-0.5 text-xs font-semibold text-[var(--color-ink)]">{project.currency}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Constrained content — pt accounts for the card overlapping from above */}
      <div className="mx-auto max-w-[960px] space-y-8 px-6 pt-16 pb-10 md:px-8">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total Time */}
        <div
          className="group relative overflow-hidden rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-0.5"
          style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 14%, var(--color-surface)), var(--color-surface) 70%)` }}
        >
          <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full blur-2xl transition-transform duration-300 group-hover:scale-110" style={{ background: accentColor, opacity: 0.25 }} />
          <div className="relative z-10 flex h-full flex-col">
            <Clock size={14} className="mb-4 opacity-40" style={{ color: accentColor }} />
            <p className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold leading-none tabular-nums tracking-tight" style={{ color: accentColor }}>
              {formatDuration(totalSeconds)}
            </p>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Total Time</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="group relative overflow-hidden rounded-2xl bg-[color-mix(in_srgb,var(--color-grape)_14%,var(--color-surface))] bg-gradient-to-br from-[color-mix(in_srgb,var(--color-grape)_14%,var(--color-surface))] to-[var(--color-surface)] p-6 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[var(--color-grape)] blur-2xl opacity-25 transition-transform duration-300 group-hover:scale-110" />
          <div className="relative z-10 flex h-full flex-col">
            <DollarSign size={14} className="mb-4 text-[var(--color-grape)] opacity-40" />
            <p className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold leading-none tabular-nums tracking-tight text-[var(--color-grape)]">
              {formatCurrency(totalEarnings, project.currency)}
            </p>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Total Earnings</p>
          </div>
        </div>

        {/* Avg Session */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color-mix(in_srgb,var(--color-tangerine)_14%,var(--color-surface))] to-[var(--color-surface)] p-6 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[var(--color-tangerine)] blur-2xl opacity-25 transition-transform duration-300 group-hover:scale-110" />
          <div className="relative z-10 flex h-full flex-col">
            <BarChart3 size={14} className="mb-4 text-[var(--color-tangerine)] opacity-40" />
            <p className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold leading-none tabular-nums tracking-tight text-[var(--color-tangerine)]">
              {formatDuration(avgSessionSeconds)}
            </p>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Avg Session</p>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Session List (2/3) */}
        <div className="lg:col-span-2">
          <SessionList projectId={id} />
        </div>

        {/* Sidebar info (1/3) */}
        <div className="space-y-8">
          <ProjectResources projectId={id} />
        </div>
      </div>

      </div> {/* end constrained content */}
    </div>
  );
}
