# Tasks: Fix Functional Errors & Improve Timer UX

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 150-250 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation (Types & Utils)

- [x] 1.1 Update `ActiveTimer` interface in `src/types/index.ts` (add `elapsedTime`, nullable `startTime`).
- [x] 1.2 Update `Session` interface in `src/types/index.ts` (change `duration` to seconds).
- [x] 1.3 Update `formatDuration` in `src/lib/utils.ts` to show `HH:MM:SS`.
- [x] 1.4 Update `calculateEarnings` in `src/lib/utils.ts` to use seconds precision.

## Phase 2: Store Logic (Zustand)

- [x] 2.1 Add `pauseTimer` and `resumeTimer` actions to `src/store/useAppStore.ts`.
- [x] 2.2 Update `startTimer` and `stopTimer` in `src/store/useAppStore.ts` for the new state shape.
- [x] 2.3 Implement store migration (v1 -> v2) in `useAppStore.ts` to convert minutes to seconds.

## Phase 3: UI Implementation

- [x] 3.1 Update `Timer.tsx` to display Pause/Resume buttons based on state.
- [x] 3.2 Fix `Timer.tsx` logic to stop the visual counter immediately when paused/stopping.
- [x] 3.3 Update `Stats.tsx` summary cards to use `HH:MM:SS` format.
- [x] 3.4 Update `SessionList.tsx` table to use `HH:MM:SS` format.

## Phase 4: Verification

- [ ] 4.1 Manual Test: Verify timer pause stops the counter.
- [ ] 4.2 Manual Test: Verify timer resume continues from previous elapsed time.
- [ ] 4.3 Manual Test: Verify earnings for 1h session ($3600s) = project hourly rate.
- [ ] 4.4 Manual Test: Verify migration of old sessions (if any exist).
