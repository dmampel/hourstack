# Proposal: Payment Management

## Goal
Implement a system to track whether sessions have been paid or are pending, allowing the user to manage their earnings effectively.

## User Review Required
- [ ] UI for marking sessions as paid: Checkbox vs. Bulk action.
- [ ] Aggregation logic: Should we show "Pending" vs "Paid" in the Stats dashboard?

## Proposed Changes

### [Component] Data Model
- Update `Session` type to include `isPaid: boolean`.
- Add `paidAt?: Date` for tracking when it was settled.

### [Component] Store
- Add `toggleSessionPayment(id: string)` action.
- Add `markSessionsAsPaid(ids: string[])` for bulk actions.

### [Component] Dashboard (Stats)
- Add a toggle/filter to show only "Pending" or "Paid" earnings.
- Show "Total Pending" and "Total Paid" separately in summary cards.

### [Component] Session List
- Add a visual indicator (e.g., a checkmark or badge) for paid sessions.
- Add a way to toggle the status directly from the list.

## Verification Plan
- Create sessions and mark them as paid.
- Verify that "Total Pending" decreases and "Total Paid" increases.
- Test bulk marking if implemented.
