# Design: Fix Functional Errors & Improve Timer UX

## Technical Approach
We will refactor the core timer state and logic to support pause/resume and high-precision tracking (seconds instead of minutes). This involves updating the state shape in Zustand, modifying the timer actions, and updating the UI to reflect these states.

## Architecture Decisions

### Decision: Unit of Time
**Choice**: Change `duration` and `elapsedTime` to **seconds**.
**Alternatives considered**: Keep minutes as float.
**Rationale**: Seconds are the natural unit for timers. Storing minutes as floats can lead to display artifacts (e.g., "0m" for 30s) and rounding confusion in earnings.

### Decision: Pause State Representation
**Choice**: Use a nullable `startTime` in `ActiveTimer`. If `startTime` is `null`, the timer is paused. `elapsedTime` stores the accumulated seconds.
**Alternatives considered**: Boolean `isPaused` flag.
**Rationale**: A nullable `startTime` combined with `elapsedTime` makes the "running total" calculation very clean: `total = elapsedTime + (running ? now - startTime : 0)`.

### Decision: Data Migration
**Choice**: Add a `version` field to the store. If `version < 2`, multiply existing session `duration` by 60.
**Alternatives considered**: Manual fix by user.
**Rationale**: Ensures existing data remains valid and earnings calculations stay correct after the units change.

## Data Flow
```
[Timer Component] ──(actions)──▶ [Zustand Store] ──(persist)──▶ [localStorage]
       ▲                               │
       └──────────(state)──────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modify | Update `Session` and `ActiveTimer` interfaces |
| `src/store/useAppStore.ts` | Modify | Implement pause/resume logic and migration |
| `src/lib/utils.ts` | Modify | Update `formatDuration` (HH:MM:SS) and `calculateEarnings` (seconds) |
| `src/components/features/sessions/Timer.tsx` | Modify | Update UI for Pause/Resume/Stop and local elapsed state |
| `src/components/features/dashboard/Stats.tsx` | Modify | Update display logic for precise durations |
| `src/components/features/sessions/SessionList.tsx` | Modify | Update display logic for precise durations |

## Interfaces / Contracts

```ts
// src/types/index.ts
export interface ActiveTimer {
  projectId: string;
  startTime: Date | null; // null means paused
  elapsedTime: number;    // seconds accumulated before last pause
}

export interface Session {
  // ...
  duration: number;       // Now in seconds
  // ...
}
```

## Testing Strategy
| Layer | What to Test | Approach |
|-------|-------------|----------|
| Manual | Timer Pause | Start timer, wait 5s, pause, wait 5s, verify display didn't move. |
| Manual | Timer Resume | Resume from pause, verify it continues from 5s. |
| Manual | Earnings | Record 1h (3600s), verify earnings = rate. |

## Migration / Rollout
Store version will be bumped to `2`.
A migration function in `onRehydrateStorage` (or inside the store's `persist` config) will convert `duration` from minutes to seconds for all existing sessions.
