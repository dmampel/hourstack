# Task Breakdown: Time Tracker MVP

## 1. Project Setup

*   [x] Initialize Next.js project with TypeScript and Tailwind CSS.
*   [x] Install necessary dependencies: Zustand, `date-fns` (or `dayjs`), `uuid`, `papaparse`.
*   [x] Configure Tailwind CSS.
*   [x] Set up project structure (folders for components, store, lib, etc.).
*   [x] Define TypeScript types for `Project` and `Session`.

## 2. State Management (Zustand)

*   [x] Create the Zustand store (`useAppStore.ts`).
*   [x] Implement state and actions for projects (add, update, delete).
*   [x] Implement state and actions for sessions.
*   [x] Set up `localStorage` persistence for the store.

## 3. Project Management Feature

*   [x] Create `ProjectList` component to display existing projects.
*   [x] Create `ProjectForm` component to add and edit projects.
*   [x] Build the `/projects` page to display and manage projects.

## 4. Core Timer Feature

*   [x] Create the `Timer` component with "Start" and "Stop" buttons.
*   [x] Connect the timer to the Zustand store to manage the `activeTimer` state.
*   [x] When the timer is stopped, create a new session and save it to the store.
*   [x] Implement the logic to calculate session duration.

## 5. Session Management

*   [x] Create a `SessionList` component to display recent sessions.
*   [x] Allow users to add a description to a session after it's created.
*   [x] Implement earnings calculation for each session.

## 6. Dashboard

*   [x] Build the `/dashboard` page.
*   [x] Display the `Timer` component on the dashboard.
*   [x] Display the `SessionList` component.
*   [x] Create the `Stats` component to show:
    *   Total hours per project.
    *   Total earnings per project.
    *   Daily, weekly, and monthly hour statistics.

## 7. Additional Features

*   [x] Implement the CSV export functionality.
*   [x] Add a simple notification/alert for a long-running timer.

## 8. Styling and Final Touches

*   [x] Apply basic styling with Tailwind CSS to all components.
*   [x] Ensure a clean and intuitive user interface.
*   [x] Test all features.
