# Tasks: Session Detail & Attachments

## Foundation
- [x] [MODIFY] Update `src/types/index.ts` to include `Attachment` interface and `notes`/`attachments` fields in `Session`.
- [x] [MODIFY] Add `addAttachment` and `removeAttachment` actions to `src/store/useAppStore.ts`.

## UI Components
- [x] [NEW] Create `src/components/features/sessions/SessionDrawer.tsx`.
  - [x] Implement slide-over animation logic.
  - [x] Add Notes textarea with auto-save.
  - [x] Add Time Info section (precise start/end).
  - [x] Add Attachment management (upload + preview).

## Integration
- [x] [MODIFY] Update `src/components/features/sessions/SessionList.tsx` to handle item click (excluding actions) and open the drawer.
- [x] [MODIFY] Ensure the drawer context is managed at the list or dashboard level.

## Polish
- [ ] Add image preview lightbox.
- [ ] Add file size validation (1MB limit).
- [ ] Ensure smooth transitions.
