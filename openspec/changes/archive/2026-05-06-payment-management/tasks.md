# Tasks: Payment Management

## Foundation
- [x] [MODIFY] Update `Session` interface in `src/types/index.ts` to include `isPaid` and `paidAt`.
- [x] [MODIFY] Add `toggleSessionPayment` and `markSessionsAsPaid` actions to `src/store/useAppStore.ts`.
- [x] [x] Implement store migration (version 4) to ensure all existing sessions have `isPaid: false`.

## Dashboard & Stats
- [x] [MODIFY] Update `src/components/features/dashboard/Stats.tsx` to calculate and display "Total Paid" and "Total Pending" cards.
- [x] [MODIFY] Add payment status filtering logic to the main session query in `Stats.tsx` (if needed) or handle it in the UI.

## Session List & UI
- [x] [MODIFY] Add checkbox selection logic to `src/components/features/sessions/SessionList.tsx`.
- [x] [MODIFY] Display payment status badge/indicator in session rows.
- [x] [x] Create a floating `BulkActionBar` component for mass payment updates.
- [x] [MODIFY] Integrate `BulkActionBar` into the main dashboard view.

## Polish
- [x] Ensure consistent formatting for the new currency cards.
- [x] Add smooth transitions for the bulk action bar.
