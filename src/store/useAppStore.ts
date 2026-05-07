'use client';

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Project, Session, ActiveTimer, Resource, Attachment } from '../types';
import { calculateEarnings } from '../lib/utils';

// ---------------------------------------------------------------------------
// Helpers — localStorage serializes Dates as ISO strings, so we revive them
// on hydration.
// ---------------------------------------------------------------------------

function reviveDates<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(reviveDates) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    // Known Date fields across Project, Session, and ActiveTimer
    const dateFields = new Set([
      'createdAt',
      'startTime',
      'endTime',
      'paidAt',
    ]);

    if (dateFields.has(key) && typeof value === 'string') {
      result[key] = new Date(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = reviveDates(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

// Custom storage that revives Date objects when reading from localStorage.
const storage: StateStorage = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      const parsed = JSON.parse(str);
      if (parsed?.state) {
        parsed.state = reviveDates(parsed.state);
      }
      return JSON.stringify(parsed);
    } catch {
      return str;
    }
  },
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name),
};

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

interface AppState {
  projects: Project[];
  sessions: Session[];
  activeTimer: ActiveTimer | null;

  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addResource: (projectId: string, resource: Omit<Resource, 'id'>) => void;
  removeResource: (projectId: string, resourceId: string) => void;

  // Timer actions
  startTimer: (projectId: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: (description?: string) => void;
  resetTimer: () => void;

  // Session actions
  updateSession: (id: string, updates: Partial<Session>) => void;
  toggleSessionPayment: (id: string) => void;
  markSessionsAsPaid: (ids: string[]) => void;
  deleteSession: (id: string) => void;
  addAttachment: (sessionId: string, attachment: Omit<Attachment, 'id'>) => void;
  removeAttachment: (sessionId: string, attachmentId: string) => void;

  // Settings actions
  setWeeklyGoal: (goal: number) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      sessions: [],
      activeTimer: null,
      weeklyGoal: 40,

      // --- Project actions ---------------------------------------------------

      addProject: (projectData) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...projectData,
              id: uuidv4(),
              createdAt: new Date(),
            },
          ],
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          // Also remove all sessions associated with this project
          sessions: state.sessions.filter((s) => s.projectId !== id),
        })),

      addResource: (projectId, resource) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  resources: [
                    ...(p.resources || []),
                    { ...resource, id: uuidv4() },
                  ],
                }
              : p
          ),
        })),

      removeResource: (projectId, resourceId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  resources: (p.resources || []).filter((r) => r.id !== resourceId),
                }
              : p
          ),
        })),

      // --- Timer actions ----------------------------------------------------

      startTimer: (projectId) =>
        set({
          activeTimer: {
            projectId,
            startTime: new Date(),
            elapsedTime: 0,
          },
        }),

      pauseTimer: () => {
        const { activeTimer } = get();
        if (!activeTimer || !activeTimer.startTime) return;

        const now = new Date();
        const sessionSeconds = Math.floor(
          (now.getTime() - activeTimer.startTime.getTime()) / 1000
        );

        set({
          activeTimer: {
            ...activeTimer,
            startTime: null,
            elapsedTime: activeTimer.elapsedTime + sessionSeconds,
          },
        });
      },

      resumeTimer: () => {
        const { activeTimer } = get();
        if (!activeTimer || activeTimer.startTime) return;

        set({
          activeTimer: {
            ...activeTimer,
            startTime: new Date(),
          },
        });
      },

      stopTimer: (description = '') => {
        const { activeTimer, projects } = get();
        if (!activeTimer) return;

        const now = new Date();
        let sessionSeconds = 0;
        if (activeTimer.startTime) {
          sessionSeconds = Math.floor(
            (now.getTime() - activeTimer.startTime.getTime()) / 1000
          );
        }

        const totalDuration = activeTimer.elapsedTime + sessionSeconds;

        const project = projects.find((p) => p.id === activeTimer.projectId);
        const hourlyRate = project?.hourlyRate ?? 0;
        const earnings = calculateEarnings(totalDuration, hourlyRate);

        const newSession: Session = {
          id: uuidv4(),
          projectId: activeTimer.projectId,
          startTime: activeTimer.startTime || now, // fallback if stopped while paused
          endTime: now,
          duration: totalDuration,
          description,
          earnings,
          isPaid: false,
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
          activeTimer: null,
        }));
      },

      resetTimer: () => {
        const { activeTimer } = get();
        if (!activeTimer) return;
        set({
          activeTimer: {
            ...activeTimer,
            startTime: activeTimer.startTime ? new Date() : null,
            elapsedTime: 0,
          },
        });
      },

      // --- Session actions --------------------------------------------------

      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== id) return s;
            
            const updatedSession = { ...s, ...updates };
            
            // Recalculate earnings if duration changed
            if (updates.duration !== undefined) {
              const project = state.projects.find((p) => p.id === updatedSession.projectId);
              const hourlyRate = project?.hourlyRate ?? 0;
              updatedSession.earnings = calculateEarnings(updatedSession.duration, hourlyRate);
            }
            
            return updatedSession;
          }),
        })),

      toggleSessionPayment: (id) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, isPaid: !s.isPaid, paidAt: !s.isPaid ? new Date() : undefined } : s
          ),
        })),

      markSessionsAsPaid: (ids) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            ids.includes(s.id) ? { ...s, isPaid: true, paidAt: new Date() } : s
          ),
        })),

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),

      addAttachment: (sessionId, attachment) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  attachments: [
                    ...(s.attachments || []),
                    { ...attachment, id: uuidv4() },
                  ],
                }
              : s
          ),
        })),

      removeAttachment: (sessionId, attachmentId) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  attachments: (s.attachments || []).filter((a) => a.id !== attachmentId),
                }
              : s
          ),
        })),

      // --- Settings actions --------------------------------------------------

      setWeeklyGoal: (weeklyGoal) => set({ weeklyGoal }),
    }),
    {
      name: 'hourstack-storage',
      version: 5,
      storage: createJSONStorage(() => storage),
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          if (persistedState.sessions) {
            persistedState.sessions = persistedState.sessions.map((s: any) => ({
              ...s,
              duration: s.duration * 60,
            }));
          }
        }
        if (version < 3) {
          if (persistedState.projects) {
            persistedState.projects = persistedState.projects.map((p: any) => ({
              ...p,
              currency: p.currency || 'ARS',
            }));
          }
        }
        if (version < 4) {
          if (persistedState.sessions) {
            persistedState.sessions = persistedState.sessions.map((s: any) => ({
              ...s,
              isPaid: s.isPaid ?? false,
            }));
          }
        }
        if (version < 5) {
          if (persistedState.weeklyGoal === undefined) {
            persistedState.weeklyGoal = 40;
          }
        }
        return persistedState;
      },
    }
  )
);
