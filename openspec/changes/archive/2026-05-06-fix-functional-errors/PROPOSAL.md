# Proposal: Fix Functional Errors & Improve Timer UX

## Intent
Address core functional bugs identified in the MVP and improve the Timer experience to support pause/resume (break) functionality and precise time tracking. The current implementation has a running timer that doesn't actually stop when requested and lacks basic "break" capabilities.

## Scope

### In Scope
- **Real Pause**: Ensure the timer stops accumulating time when the user clicks "Stop/Pause".
- **Resume Capability**: Allow users to resume a paused timer without creating a new session.
- **Precision**: Store and display time in seconds to avoid rounding errors.
- **Display Fix**: Update all time displays to show `HH:MM:SS`.
- **Earnings Fix**: Use second-precision for earnings calculation.

### Out of Scope
- Multi-project simultaneous tracking.
- Automatic idle detection.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- **timer**: Add pause/resume state and logic.
- **session-management**: Change duration storage from minutes to seconds.
- **dashboard**: Update stats display for second-precision.

## Approach
1. **Refactor Store**: Update `ActiveTimer` type and state to support `elapsedTime` (seconds) and `paused` state.
2. **Migration**: Update `Session` type to use `duration` in seconds.
3. **Logic Update**: Update `stopTimer`, `pauseTimer`, and `resumeTimer` actions in `useAppStore`.
4. **UI Update**: Modify `Timer.tsx` to handle the new states and show Pause/Resume buttons.
5. **Formatting**: Update `formatDuration` in `utils.ts` to show full `HH:MM:SS`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modified | Update interfaces for Session and ActiveTimer |
| `src/store/useAppStore.ts` | Modified | Update timer actions and persistence logic |
| `src/lib/utils.ts` | Modified | Update `formatDuration` and `calculateEarnings` |
| `src/components/features/sessions/Timer.tsx` | Modified | Add Pause/Resume UI and logic |
| `src/components/features/dashboard/Stats.tsx` | Modified | Update stats display |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Data inconsistency | Medium | Migration logic to convert existing session minutes to seconds |
| Timer drift | Low | Use `startTime` comparison instead of just incrementing seconds |

## Rollback Plan
Revert changes to `useAppStore.ts` and `utils.ts`. Existing data in `localStorage` might need manual correction if already migrated.

## Success Criteria
- [ ] Timer visually stops when paused.
- [ ] Timer resumes correctly from previous elapsed time.
- [ ] Session history shows precise `HH:MM:SS`.
- [ ] Earnings match `(seconds / 3600) * rate`.
