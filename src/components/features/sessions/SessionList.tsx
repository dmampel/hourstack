'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import { SessionDrawer } from './SessionDrawer';
import type { Session } from '@/types';

const MAX_SESSIONS = 20;

// Parses HH:MM:SS or Xh Ym Zs string back to seconds
function parseDuration(val: string): number {
  const normalized = val.toLowerCase();
  // Handle Xh Ym Zs format
  if (normalized.includes('h') || normalized.includes('m') || normalized.includes('s')) {
    const h = parseInt(normalized.match(/(\d+)h/)?.[1] || '0');
    const m = parseInt(normalized.match(/(\d+)m/)?.[1] || '0');
    const s = parseInt(normalized.match(/(\d+)s/)?.[1] || '0');
    return h * 3600 + m * 60 + s;
  }

  // Fallback to HH:MM:SS
  const parts = val.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return Number(parts[0]) || 0;
}

interface SessionListProps {
  projectId?: string;
}

export default function SessionList({ projectId }: SessionListProps) {
  const projects = useAppStore((state) => state.projects);
  const sessions = useAppStore((state) => state.sessions);
  const updateSession = useAppStore((state) => state.updateSession);
  const deleteSession = useAppStore((state) => state.deleteSession);

  // id of the session whose description is being edited
  const toggleSessionPayment = useAppStore((state) => state.toggleSessionPayment);
  const markSessionsAsPaid = useAppStore((state) => state.markSessionsAsPaid);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'description' | 'duration' | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const filteredSessions = sessions.filter((s) => {
    // Filter by project if provided
    if (projectId && s.projectId !== projectId) return false;
    
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return !s.isPaid;
    if (statusFilter === 'paid') return s.isPaid;
    return true;
  });

  const recent = [...filteredSessions]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, MAX_SESSIONS);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
      const newDuration = parseDuration(editingValue);
      updateSession(id, { duration: newDuration });
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
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-800">Recent Sessions</h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            {recent.length} session{recent.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
          {(['all', 'pending', 'paid'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                statusFilter === filter
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-sm text-zinc-400">No {statusFilter !== 'all' ? statusFilter : ''} sessions found.</p>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100">
        {recent.map((session) => {
          const project = projects.find((p) => p.id === session.projectId);
          const isEditing = editingId === session.id;

          return (
            <li 
              key={session.id} 
              onClick={() => setSelectedSessionId(session.id)}
              className={`group flex items-start gap-4 px-6 py-4 transition-colors hover:bg-zinc-50 cursor-pointer ${selectedIds.includes(session.id) ? 'bg-indigo-50/30' : ''}`}
            >
              {/* Checkbox for bulk actions — only show if not paid */}
              <div className="mt-1 flex items-center w-4" onClick={(e) => e.stopPropagation()}>
                {!session.isPaid && (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(session.id)}
                    onChange={() => toggleSelect(session.id)}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                )}
              </div>

              {/* Center: main info */}
              <div className="min-w-0 flex-1 space-y-1">
                {/* Project name + date */}
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  {!projectId && project && (
                    <Link 
                      href={`/projects/${project.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-semibold text-zinc-800 hover:text-indigo-600 transition-colors"
                    >
                      {project.name}
                    </Link>
                  )}
                  {projectId && (
                    <span className="text-sm font-semibold text-zinc-800">
                      {project?.name ?? 'Unknown project'}
                    </span>
                  )}
                  {project?.client && (
                    <span className="text-xs text-zinc-400">{project.client}</span>
                  )}
                  <span className="ml-auto text-xs text-zinc-400">
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
                    className="w-[50%] rounded border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(session, 'description'); }}
                    title="Click to edit description"
                    className="block w-full truncate text-left text-sm text-zinc-500 hover:text-zinc-700"
                  >
                    {session.description || (
                      <span className="italic text-zinc-300">Add a description…</span>
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
                      className="w-24 rounded border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-zinc-800 outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(session, 'duration'); }}
                      title="Click to edit duration (HH:MM:SS)"
                      className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
                    >
                      {formatDuration(session.duration)}
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-600">
                      {formatCurrency(session.earnings, project?.currency)}
                    </span>
                    
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {session.isPaid ? (
                      <span className="flex items-center gap-0.5 rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleSessionPayment(session.id)}
                        className="rounded border border-amber-200 bg-amber-50 px-1 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 hover:bg-amber-100 transition-colors"
                      >
                        Pending
                      </button>
                    )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: delete button (visible on hover) */}
              <button
                onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                title="Delete session"
                className="mt-0.5 flex-shrink-0 rounded p-1 text-zinc-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                aria-label="Delete session"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 3.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    )}

    {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-4 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-2xl ring-1 ring-white/10">
            <span className="text-zinc-400">
              {selectedIds.length} {selectedIds.length === 1 ? 'session' : 'sessions'} selected
            </span>
            <div className="h-4 w-px bg-zinc-700" />
            <button
              onClick={handleBulkMarkAsPaid}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Mark as Paid
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <SessionDrawer 
        sessionId={selectedSessionId} 
        onClose={() => setSelectedSessionId(null)} 
      />
    </div>
  );
}
