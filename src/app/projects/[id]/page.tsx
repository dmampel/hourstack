'use client';

import { useParams, useRouter } from 'next/navigation';
import { Clock, DollarSign, BarChart3, ArrowLeft, ExternalLink } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import SessionList from '@/components/features/sessions/SessionList';
import ProjectResources from '@/components/features/projects/ProjectResources';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

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
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div 
        className="relative -mx-6 -mt-8 overflow-hidden px-8 py-10 lg:-mx-10 lg:px-12"
        style={{ background: headerBg }}
      >
        <div className="relative z-10 space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
          >
            <ArrowLeft size={14} /> Back
          </button>
          
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: accentColor }} 
                />
                <h1 className="font-[family-name:var(--font-fraunces)] text-[var(--text-h1)] font-semibold text-[var(--color-ink)]">
                  {project.name}
                </h1>
              </div>
              <p className="mt-1 text-[var(--color-ink-soft)]">
                Client: <span className="font-medium text-[var(--color-ink)]">{project.client || 'Internal'}</span> • 
                Rate: <span className="font-medium text-[var(--color-ink)]">{formatCurrency(project.hourlyRate, project.currency)}/hr</span>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={() => router.push('/projects')}>
                Edit Project
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div 
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[80px] opacity-20"
          style={{ background: accentColor }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card padding="md" className="flex items-center gap-4 border-l-4" style={{ borderLeftColor: accentColor }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-muted)] text-[var(--color-ink-soft)]">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Total Time</p>
            <p className="text-xl font-bold tabular-nums text-[var(--color-ink)]">{formatDuration(totalSeconds)}</p>
          </div>
        </Card>

        <Card padding="md" className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-muted)] text-[var(--color-grape)]">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Total Earnings</p>
            <p className="text-xl font-bold tabular-nums text-[var(--color-ink)]">{formatCurrency(totalEarnings, project.currency)}</p>
          </div>
        </Card>

        <Card padding="md" className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-muted)] text-[var(--color-tangerine)]">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Avg Session</p>
            <p className="text-xl font-bold tabular-nums text-[var(--color-ink)]">{formatDuration(avgSessionSeconds)}</p>
          </div>
        </Card>
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
          
          <Card padding="md" title="Project Details">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-[var(--color-line)] pb-2">
                <span className="text-[var(--color-ink-soft)]">Created</span>
                <span className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-line)] pb-2">
                <span className="text-[var(--color-ink-soft)]">Sessions</span>
                <span className="font-medium">{sessions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-soft)]">Currency</span>
                <span className="font-medium">{project.currency}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
