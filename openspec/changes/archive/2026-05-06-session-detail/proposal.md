# Proposal: Session Detail View

## Goal
Implement a detailed view for each session that allows users to see and manage extended information like notes, exact timestamps, and attachments.

## User Review Required
- [ ] **Interaction**: Should it be an expandable row (Accordion style) or a Modal?
- [ ] **Attachments**: For now, should we just implement the "Notes" field and leave placeholders for files/screenshots?

## Proposed Changes

### [Component] Data Model
- Add `notes: string` to `Session` type.
- (Future) Add `attachments: Attachment[]` to `Session`.

### [Component] Session List
- Modify each session item to be clickable/expandable.
- When expanded, show:
  - Exact Start and End timestamps.
  - A text area for editing `notes`.
  - Placeholders for "Attachments" and "Screenshots".

### [Component] Store
- Add `updateSessionNotes(id: string, notes: string)` action.

## Verification Plan
- Expand a session and verify all details are visible.
- Edit the notes and ensure they persist across refreshes.
- Verify that exact start/end times match the session creation data.
