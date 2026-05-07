'use client';

import { Target } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration } from '@/lib/utils';
import { isThisWeek } from 'date-fns';

export default function WeeklyProgress() {
  const sessions = useAppStore((s) => s.sessions);
  const weeklyGoal = useAppStore((s) => s.weeklyGoal);

  const weekSeconds = sessions
    .filter((s) => isThisWeek(new Date(s.startTime), { weekStartsOn: 1 }))
    .reduce((sum, s) => sum + s.duration, 0);

  const weekHours = weekSeconds / 3600;
  const progress = Math.min((weekHours / weeklyGoal) * 100, 100);
  const isGoalMet = weekHours >= weeklyGoal;

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Weekly Goal</p>
        <Target size={12} className={isGoalMet ? 'text-[var(--color-lime)]' : 'text-[var(--color-ink-soft)]'} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-[var(--color-ink)] tabular-nums">
            {Math.floor(weekHours)}h / {weeklyGoal}h
          </span>
          <span className="text-[10px] font-medium text-[var(--color-ink-soft)]">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: isGoalMet ? 'var(--color-lime)' : 'var(--gradient-brand)',
            }}
          />
        </div>
        
        <p className="text-[10px] text-[var(--color-ink-soft)] leading-tight">
          {isGoalMet 
            ? "Goal achieved! Keep it up. 🚀" 
            : `${Math.max(0, weeklyGoal - Math.floor(weekHours))}h remaining to hit your target.`}
        </p>
      </div>
    </div>
  );
}
