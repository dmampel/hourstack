'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration } from '@/lib/utils';
import Button from '@/components/ui/Button';

const EIGHT_HOURS_IN_SECONDS = 8 * 60 * 60;

export default function Timer() {
  const projects = useAppStore((state) => state.projects);
  const activeTimer = useAppStore((state) => state.activeTimer);
  const startTimer = useAppStore((state) => state.startTimer);
  const pauseTimer = useAppStore((state) => state.pauseTimer);
  const resumeTimer = useAppStore((state) => state.resumeTimer);
  const stopTimer = useAppStore((state) => state.stopTimer);
  const resetTimer = useAppStore((state) => state.resetTimer);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [elapsed, setElapsed] = useState<number>(0);
  const [isStopping, setIsStopping] = useState(false);
  const [description, setDescription] = useState('');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    <div className="flex flex-col gap-2">
      {/* Card — display only */}
      <div className="rounded-[var(--radius-lg)]" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-grape) 8%, white), color-mix(in srgb, var(--color-blush) 6%, white))' }}>
        <div className="flex flex-col items-center gap-0.5 py-4 px-4">
          {activeTimer ? (
            <>
              <span className="font-[family-name:var(--font-fraunces)] tabular-nums text-2xl font-semibold leading-none text-[var(--color-grape)]">
                {formatDuration(elapsed)}
              </span>
              {activeProject && (
                <span className="text-xs font-medium text-[var(--color-ink-soft)] truncate max-w-full text-center mt-0.5">
                  {activeProject.name}
                </span>
              )}
              {isOverEightHours && (
                <span className="text-xs font-medium text-red-500">Over 8h!</span>
              )}
            </>
          ) : (
            <>
              <span className="font-[family-name:var(--font-fraunces)] tabular-nums text-2xl font-semibold leading-none text-[var(--color-grape)] opacity-30">
                00:00:00
              </span>
              <span className="text-xs text-[var(--color-ink-soft)] mt-0.5">Stay focused, achieve more.</span>
            </>
          )}
        </div>
      </div>

      {/* Controls — outside the card, full width */}
      {activeTimer ? (
        isStopping ? (
          <div className="flex flex-col gap-2">
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
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-soft)] outline-none focus:border-[var(--color-grape)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-grape)_15%,transparent)]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--gradient-brand)' }}
              >
                Save Session
              </button>
              <button
                onClick={handleCancelStop}
                className="rounded-[var(--radius-md)] border border-[var(--color-line)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-muted)]"
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
                className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-line)]"
              >
                <Pause size={16} /> Pause
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--gradient-brand)' }}
              >
                <Play size={16} /> Resume
              </button>
            )}
            <button
              onClick={handleStop}
              className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-100"
            >
              <Square size={16} /> Finish
            </button>
            <button
              onClick={resetTimer}
              title="Restart Timer"
              className="shrink-0 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface-muted)] px-3 py-2.5 text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-line)] hover:text-[var(--color-grape)]"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full appearance-none rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] pl-4 pr-10 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-grape)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-grape)_15%,transparent)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={projects.length === 0}
            >
              <option value="">
                {projects.length === 0 ? 'No projects yet' : 'Select a project…'}
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}{p.client ? ` — ${p.client}` : ''}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
          </div>
          <button
            onClick={handleStart}
            disabled={!selectedProjectId}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Play size={18} /> Start Timer
          </button>
        </div>
      )}
    </div>
  );
}
