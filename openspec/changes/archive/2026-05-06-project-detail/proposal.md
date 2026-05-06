# Proposal: Project Detail Page & Resources

## Goal
Create a dedicated page for each project to manage specific resources (links) and view the full history of sessions associated with it.

## User Review Required
- [ ] **Navigation**: How do we get to this page? (Clicking the project name in the Dashboard or in the Projects list?)
- [ ] **Layout**: Should it look like the Dashboard but filtered, or a more "document-like" view focusing on resources?

## Proposed Changes

### [Component] Data Model
- Update `Project` interface to include `resources: Resource[]`.
- `Resource` interface: `{ id: string; label: string; url: string; }`.

### [Component] Routing
- Create dynamic route: `/src/app/projects/[id]/page.tsx`.

### [Component] UI: Project Detail Page
- **Header**: Project name, client, and current stats (Total hours/earnings).
- **Resources Section**: A list of external links (e.g., Repo, Design, Docs) with an "Add Resource" form.
- **Sessions List**: A filtered version of `SessionList` showing only this project's sessions.
- **Actions**: Edit project details directly from here.

### [Component] Store
- Add `addResource(projectId, resource)` and `removeResource(projectId, resourceId)` actions.

## Verification Plan
- Navigate to a project page and verify only its sessions are shown.
- Add/Remove resources and ensure they persist.
- Verify that total earnings on this page match the sum of its sessions.
