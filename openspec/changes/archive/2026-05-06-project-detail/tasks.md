# Tasks: Project Detail Page

## Foundation
- [x] [MODIFY] Update `src/types/index.ts` to include `Resource` interface and `resources` in `Project`.
- [x] [MODIFY] Add `addResource` and `removeResource` actions to `src/store/useAppStore.ts`.

## Page Implementation
- [x] [NEW] Create `src/app/projects/[id]/page.tsx`.
  - [x] Fetch project and filtered sessions.
  - [x] Implement layout (Header, Stats, Main Content).
- [x] [NEW] Create `src/components/features/projects/ResourcesSection.tsx`.

## UI Integration
- [x] [MODIFY] Update `src/components/features/sessions/SessionList.tsx` to support `projectId` prop and conditional filtering/rendering.
- [x] [MODIFY] Add navigation links to project names in `SessionList.tsx` and `Dashboard.tsx`.
- [x] [MODIFY] Add navigation links to project cards in `src/app/projects/page.tsx`.

## Polish
- [x] Ensure consistent styling with the rest of the app.
- [x] Add "Empty State" for resources.


