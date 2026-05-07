'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import { SessionDrawer } from './SessionDrawer';
import Card from '@/components/ui/Card';
import type { Session } from '@/types';

const MAX_SESSIONS = 20;

function parseDuration(val: string): number {
  const normalized = val.toLowerCase();
  if (normalized.includes('h') || normalized.includes('m') || normalized.includes('s')) {
    const h = parseInt(normalized.match(/(\d+)h/)?.[1] || '0');
    const m = parseInt(normalized.match(/(\d+)m/)?.[1] || '0');
    const s = parseInt(normalized.match(/(\d+)s/)?.[1] || '0');
    return h * 3600 + m * 60 + s;
  }
  const parts = val.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(parts[0]) || 0;
}

interface SessionListProps {
  projectId?: string;
  limit?: number;
}

export default function SessionList({ projectId, limit }: SessionListProps) {
  const projects = useAppStore((state) => state.projects);
  const sessions = useAppStore((state) => state.sessions);
  const updateSession = useAppStore((state) => state.updateSession);
  const deleteSession = useAppStore((state) => state.deleteSession);
  const toggleSessionPayment = useAppStore((state) => state.toggleSessionPayment);
  const markSessionsAsPaid = useAppStore((state) => state.markSessionsAsPaid);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'description' | 'duration' | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const filteredSessions = useMemo(() => sessions.filter((s) => {
    if (projectId && s.projectId !== projectId) return false;
    if (statusFilter === 'pending') return !s.isPaid;
    if (statusFilter === 'paid') return s.isPaid;
    return true;
  }), [sessions, projectId, statusFilter]);

  const recent = useMemo(() =>
    [...filteredSessions]
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, limit || MAX_SESSIONS),
    [filteredSessions, limit]
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleBulkMarkAsPaid = () => {
    markSessionsAsPaid(selectedIds);
    setSelectedIds([]);
  };

  const startEdit = (session: Session, field: 'description' | 'duration') => {
    setEditingId(session.id);
    setEditingField(field);
    setEditingValue(field === 'description' ? session.description : formatDuration(session.duration));
  };

  const commitEdit = (id: string) => {
    if (!editingField) return;
    if (editingField === 'description') {
      updateSession(id, { description: editingValue.trim() });
    } else {
      updateSession(id, { duration: parseDuration(editingValue) });
    }
    setEditingId(null);
    setEditingField(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setEditingValue('');
  };

  return (
    <Card padding="sm" className="overflow-hidden !p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-4">
        <div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[var(--color-ink)]">
            {projectId ? 'Project History' : 'Recent Sessions'}
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-ink-soft)]">
            {limit && filteredSessions.length > limit ? `Showing ${limit} of ${filteredSessions.length} sessions` : `${filteredSessions.length} session${filteredSessions.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] p-0.5">
          {(['all', 'pending', 'paid'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-[var(--radius-sm)] px-3 py-1 text-xs font-medium capitalize transition-all ${
                statusFilter === filter
                  ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-soft)]'
                  : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-sm text-[var(--color-ink-soft)]">
            No {statusFilter !== 'all' ? statusFilter : ''} sessions found.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-line)]">
          {recent.map((session) => {
            const project = projects.find((p) => p.id === session.projectId);
            const isEditing = editingId === session.id;
            const projectColor = project?.color || 'var(--color-grape)';

            return (
              <li
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`group relative flex items-start gap-4 px-6 py-4 transition-all cursor-pointer hover:bg-[var(--color-surface-muted)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-px ${
                  selectedIds.includes(session.id) ? 'bg-[color-mix(in_srgb,var(--color-grape)_5%,var(--color-surface))]' : ''
                }`}
              >
                {/* 6px left accent bar in project color */}
                <span
                  className="absolute left-0 top-0 h-full w-1.5 rounded-r-full opacity-70"
                  style={{ backgroundColor: projectColor }}
                  aria-hidden="true"
                />

                {/* Checkbox */}
                <div className="mt-1 flex w-4 items-center" onClick={(e) => e.stopPropagation()}>
                  {!session.isPaid && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(session.id)}
                      onChange={() => toggleSelect(session.id)}
                      className="h-4 w-4 rounded border-[var(--color-line)] accent-[var(--color-grape)]"
                    />
                  )}
                </div>

                {/* Main info */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    {!projectId && project && (
                      <Link
                        href={`/projects/${project.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-grape)]"
                      >
                        {project.name}
                      </Link>
                    )}
                    {projectId && (
                      <span className="text-sm font-semibold text-[var(--color-ink)]">
                        {project?.name ?? 'Unknown project'}
                      </span>
                    )}
                    {project?.client && (
                      <span className="text-xs text-[var(--color-ink-soft)]">{project.client}</span>
                    )}
                    <span className="ml-auto text-xs text-[var(--color-ink-soft)]">
                      {format(new Date(session.startTime), 'h:mm aaaa - d MMM, yyyy')}
                    </span>
                  </div>

                  {/* Description — inline editable */}
                  {isEditing && editingField === 'description' ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit(session.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      onBlur={() => commitEdit(session.id)}
                      autoFocus
                      className="w-[50%] rounded-[var(--radius-sm)] border border-[var(--color-grape)] bg-[color-mix(in_srgb,var(--color-grape)_8%,white)] px-2 py-0.5 text-sm text-[var(--color-ink)] outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-grape)_20%,transparent)]"
                    />
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(session, 'description'); }}
                      title="Click to edit description"
                      className="block w-full truncate text-left text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                    >
                      {session.description || (
                        <span className="italic text-[var(--color-line)]">Add a description…</span>
                      )}
                    </button>
                  )}

                  {/* Duration + earnings */}
                  <div className="flex items-center gap-3 pt-0.5">
                    {isEditing && editingField === 'duration' ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit(session.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        onBlur={() => commitEdit(session.id)}
                        autoFocus
                        placeholder="HH:MM:SS"
                        className="w-24 rounded-[var(--radius-sm)] border border-[var(--color-grape)] bg-[color-mix(in_srgb,var(--color-grape)_8%,white)] px-2 py-0.5 text-xs font-medium text-[var(--color-ink)] outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-grape)_20%,transparent)]"
                      />
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(session, 'duration'); }}
                        title="Click to edit duration (HH:MM:SS)"
                        className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-muted)] px-2 py-0.5 text-xs font-medium text-[var(--color-ink-soft)] tabular-nums hover:bg-[var(--color-line)]"
                      >
                        {formatDuration(session.duration)}
                      </button>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold tabular-nums text-[var(--color-grape)]">
                        {formatCurrency(session.earnings, project?.currency)}
                      </span>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {session.isPaid ? (
                          <span className="flex items-center gap-0.5 rounded bg-[color-mix(in_srgb,var(--color-lime)_30%,white)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-lime) 70%, #1B1A22)' }}>
                            ✓ Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleSessionPayment(session.id)}
                            className="rounded border border-[color-mix(in_srgb,var(--color-tangerine)_30%,white)] bg-[color-mix(in_srgb,var(--color-tangerine)_12%,white)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-tangerine)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-tangerine)_20%,white)]"
                          >
                            Pending
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                  title="Delete session"
                  aria-label="Delete session"
                  className="mt-0.5 flex-shrink-0 rounded-[var(--radius-sm)] p-1 text-[var(--color-line)] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 3.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {limit && filteredSessions.length > limit && (
        <div className="border-t border-[var(--color-line)] p-4 text-center">
          <Link
            href="/sessions"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-grape)] transition-colors hover:text-[var(--color-ink)]"
          >
            View all sessions
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-4 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-white shadow-2xl ring-1 ring-white/10">
            <span className="text-[var(--color-ink-soft)]">
              {selectedIds.length} {selectedIds.length === 1 ? 'session' : 'sessions'} selected
            </span>
            <div className="h-4 w-px bg-[var(--color-ink-soft)]" />
            <button onClick={handleBulkMarkAsPaid} className="text-[var(--color-lime)] hover:opacity-80 transition-opacity">
              Mark as Paid
            </button>
            <button onClick={() => setSelectedIds([])} className="text-[var(--color-ink-soft)] hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <SessionDrawer sessionId={selectedSessionId} onClose={() => setSelectedSessionId(null)} />
    </Card>
  );
}
