'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import SessionList from '@/components/features/sessions/SessionList';
import { ResourcesSection } from '@/components/features/projects/ResourcesSection';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const projects = useAppStore((state) => state.projects);
  const sessions = useAppStore((state) => state.sessions);

  const project = projects.find((p) => p.id === id);
  const projectSessions = useMemo(() => sessions.filter((s) => s.projectId === id), [sessions, id]);

  // Project-specific stats
  const totalDuration = useMemo(() => projectSessions.reduce((sum, s) => sum + s.duration, 0), [projectSessions]);
  const totalPaid = useMemo(() => projectSessions.filter(s => s.isPaid).reduce((sum, s) => sum + s.earnings, 0), [projectSessions]);
  const totalPending = useMemo(() => projectSessions.filter(s => !s.isPaid).reduce((sum, s) => sum + s.earnings, 0), [projectSessions]);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-zinc-800">Project not found</h1>
        <Link href="/" className="mt-4 text-indigo-600 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-zinc-100 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-indigo-600 transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Dashboard
          </Link>
          
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color || '#6366f1' }} />
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{project.name}</h1>
              </div>
              <p className="mt-1 text-zinc-500">{project.client || 'Internal Project'}</p>
            </div>

            <div className="flex gap-4">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Time</p>
                <p className="text-xl font-bold text-zinc-900 tabular-nums">{formatDuration(totalDuration)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Paid</p>
                <p className="text-xl font-bold text-emerald-700 tabular-nums">{formatCurrency(totalPaid, project.currency)}</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-3 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending</p>
                <p className="text-xl font-bold text-amber-700 tabular-nums">{formatCurrency(totalPending, project.currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main: Sessions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Session History</h2>
              <span className="text-xs text-zinc-400">{projectSessions.length} sessions total</span>
            </div>
            <div className="rounded-3xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
              <SessionList projectId={id} />
            </div>
          </div>

          {/* Sidebar: Resources */}
          <div className="space-y-6">
            <ResourcesSection projectId={id} resources={project.resources || []} />
            
            {/* Quick Actions / Project Details Card */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Hourly Rate</p>
                  <p className="font-bold text-zinc-700">{formatCurrency(project.hourlyRate, project.currency)} / hr</p>
                </div>
                <div className="pt-4 border-t border-zinc-50">
                  <button className="w-full rounded-xl bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors">
                    Edit Project Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
