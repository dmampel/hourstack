# Technical Design: Payment Management

## Architecture Overview
The system will extend the existing `Session` model and `useAppStore` to handle payment states. The UI will be updated to support multi-selection and status visualization.

## Data Models

### [MODIFY] `Session` (types/index.ts)
```ts
export interface Session {
  id: string;
  projectId: string;
  description: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  duration: number;  // in seconds
  earnings: number;
  isPaid: boolean;   // [NEW]
  paidAt?: string;   // [NEW] ISO string
}
```

## Store Actions

### [NEW] `toggleSessionPayment(id: string)`
- Toggles `isPaid` for a single session.
- If true, sets `paidAt` to current date.

### [NEW] `markSessionsAsPaid(ids: string[])`
- Sets `isPaid: true` and `paidAt: current` for all matching IDs.

## Component Design

### `SessionList.tsx`
- **State**: `selectedIds: string[]`.
- **Logic**:
  - Show a checkbox on the left of each session item.
  - If `selectedIds.length > 0`, display a floating "Bulk Actions" bar at the bottom.
- **Visuals**:
  - Paid sessions get a subtle "Paid" badge or a green checkmark next to the earnings.

### `Stats.tsx`
- **Calculation**:
  - `paidTotal = sessions.filter(s => s.isPaid).reduce(...)`
  - `pendingTotal = sessions.filter(s => !s.isPaid).reduce(...)`
- **Layout**:
  - Update the grid to show "Total Paid" and "Total Pending" side-by-side.

### `Dashboard.tsx` (or parent)
- Add a filter bar: `[All] [Pending] [Paid]`.

## Design Decisions
- **Why Checkboxes?** They are the standard for bulk actions.
- **Why Separate Cards?** Visualizing "Pending" money creates a sense of urgency/progress for the user.
- **Migration**: Existing sessions will default to `isPaid: false`.
