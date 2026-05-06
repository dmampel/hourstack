# Technical Design: Project Detail Page

## Data Model Updates

### [MODIFY] `Project` (types/index.ts)
```ts
export interface Resource {
  id: string;
  label: string;
  url: string;
}

export interface Project {
  // ... existing
  resources?: Resource[];
}
```

## Routing & Page Layout

### Route: `/src/app/projects/[id]/page.tsx` [NEW]
- **Header**: Large title with project name + client. "Back to Dashboard" link.
- **Stats Row**: Small cards showing "Total Time", "Paid Earnings", "Pending Earnings" (specific to this project).
- **Two-Column Layout**:
  - **Left (Main)**: `SessionList` component, but restricted to this project.
  - **Right (Sidebar)**: `ResourcesCard`.
    - List of links with icons.
    - Inline form to add new resources.

## Component Updates

### [MODIFY] `SessionList.tsx`
- Add an optional `projectId` prop. If provided, filter sessions by that ID and hide the project name/badge from rows (to save space).

### [NEW] `ResourcesSection.tsx`
- Manage adding/removing resources via `useAppStore`.

## Store Actions

### [NEW] `addResource(projectId: string, resource: Omit<Resource, 'id'>)`
### [NEW] `removeResource(projectId: string, resourceId: string)`

## Navigation Integration
- Wrap project names in `Link` from `next/link`.
