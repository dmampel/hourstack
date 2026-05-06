'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

// Formats elapsed seconds as Xh Ym Zs
function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  
  return parts.join(' ');
}

const EIGHT_HOURS_IN_SECONDS = 8 * 60 * 60;

export default function Timer() {
  const projects = useAppStore((state) => state.projects);
  const activeTimer = useAppStore((state) => state.activeTimer);
  const startTimer = useAppStore((state) => state.startTimer);
  const pauseTimer = useAppStore((state) => state.pauseTimer);
  const resumeTimer = useAppStore((state) => state.resumeTimer);
  const stopTimer = useAppStore((state) => state.stopTimer);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [elapsed, setElapsed] = useState<number>(0);
  const [isStopping, setIsStopping] = useState(false);
  const [description, setDescription] = useState('');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second while timer is active
  useEffect(() => {
    if (!activeTimer) {
      setElapsed(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const computeElapsed = () => {
      const baseSeconds = activeTimer.elapsedTime;
      const runningSeconds = activeTimer.startTime
        ? Math.floor((Date.now() - new Date(activeTimer.startTime).getTime()) / 1000)
        : 0;
      setElapsed(baseSeconds + runningSeconds);
    };

    computeElapsed();

    if (activeTimer.startTime && !isStopping) {
      intervalRef.current = setInterval(computeElapsed, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeTimer, isStopping]);

  const handleStart = () => {
    if (!selectedProjectId) return;
    startTimer(selectedProjectId);
    setIsStopping(false);
    setDescription('');
  };

  const handleStop = () => {
    setIsStopping(true);
  };

  const handleSave = () => {
    stopTimer(description.trim());
    setIsStopping(false);
    setDescription('');
    setSelectedProjectId('');
  };

  const handleCancelStop = () => {
    setIsStopping(false);
    setDescription('');
  };

  const activeProject = activeTimer
    ? projects.find((p) => p.id === activeTimer.projectId)
    : null;

  const isOverEightHours = elapsed >= EIGHT_HOURS_IN_SECONDS;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-zinc-800">Timer</h2>

      {/* Active timer display */}
      {activeTimer ? (
        <div className="space-y-4">
          {/* Elapsed time */}
          <div className="flex flex-col items-center gap-1 rounded-xl bg-indigo-50 px-6 py-5">
            <span
              className={`font-mono text-5xl font-bold tracking-tight ${
                isOverEightHours ? 'text-red-500' : 'text-indigo-600'
              }`}
            >
              {formatElapsed(elapsed)}
            </span>
            {activeProject && (
              <span className="mt-1 text-sm font-medium text-zinc-500">
                {activeProject.name}
                {activeProject.client ? ` — ${activeProject.client}` : ''}
              </span>
            )}
          </div>

          {/* Over 8 hours warning */}
          {isOverEightHours && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="font-semibold">Warning:</span> Timer has been running for over 8 hours. Did you forget to stop it?
            </div>
          )}

          {/* Stop / Save flow */}
          {isStopping ? (
            <div className="space-y-3">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancelStop();
                }}
                placeholder="Description (optional)"
                autoFocus
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
                >
                  Save Session
                </button>
                <button
                  onClick={handleCancelStop}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              {activeTimer.startTime ? (
                <button
                  onClick={pauseTimer}
                  className="flex-1 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 active:bg-indigo-200"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 active:bg-emerald-700"
                >
                  Resume
                </button>
              )}
              <button
                onClick={handleStop}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 active:bg-red-700"
              >
                Stop
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Idle — project selector + start button */
        <div className="space-y-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={projects.length === 0}
          >
            <option value="">
              {projects.length === 0 ? 'No projects yet' : 'Select a project…'}
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.client ? ` — ${p.client}` : ''}
              </option>
            ))}
          </select>

          <button
            onClick={handleStart}
            disabled={!selectedProjectId}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start Timer
          </button>
        </div>
      )}
    </div>
  );
}
