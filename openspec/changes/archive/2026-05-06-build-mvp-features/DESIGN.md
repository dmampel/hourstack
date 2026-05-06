# Technical Design: Time Tracker MVP

## Stack

*   **Framework**: Next.js
*   **Styling**: Tailwind CSS
*   **State Management**: Zustand
*   **Persistence**: localStorage (for MVP)

## Data Models

### Project

```json
{
  "id": "string",
  "name": "string",
  "client": "string",
  "hourlyRate": "number",
  "createdAt": "date"
}
```

### Session

```json
{
  "id": "string",
  "projectId": "string",
  "startTime": "date",
  "endTime": "date",
  "duration": "number",
  "description": "string",
  "earnings": "number"
}
```

## Application Structure

```
/src
  /components
    /ui                 # Reusable UI components (Button, Card, etc.)
    /features           # Feature-specific components
      /projects
        ProjectList.tsx
        ProjectForm.tsx
      /sessions
        SessionList.tsx
        Timer.tsx
      /dashboard
        Stats.tsx
  /app                  # Next.js App Router
    /dashboard          # Dashboard page
      page.tsx
    /projects           # Projects page
      page.tsx
  /store
    useAppStore.ts      # Zustand store
  /lib
    /utils.ts           # Utility functions (time, calculations)
    /hooks.ts           # Custom hooks
    /csv.ts             # CSV export logic
  /types
    index.ts            # TypeScript types for models
```

## State Management (Zustand)

A single store (`useAppStore`) will manage the application state.

*   **State**:
    *   `projects`: An array of `Project` objects.
    *   `sessions`: An array of `Session` objects.
    *   `activeTimer`: An object containing the `startTime` and `projectId` for the currently running timer.
*   **Actions**:
    *   `addProject`, `updateProject`, `deleteProject`
    *   `startTimer`, `stopTimer` (which creates a new session)
    *   `addSession`, `updateSession`, `deleteSession`
    *   `exportSessionsToCSV`

## Persistence (localStorage)

The Zustand store will be persisted to `localStorage` using Zustand's `persist` middleware. This will keep the user's data saved in their browser between sessions. For the MVP, this avoids the need for a backend database.
