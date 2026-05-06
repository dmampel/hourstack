# Hourstack MVP

A premium time-tracking application for freelancers and professionals.

## Current State: MVP Completed 🚀

The initial MVP features have been successfully implemented following the Spec-Driven Development (SDD) process.

### Features

#### 1. Project Management
- Create and edit projects with custom hourly rates and currencies (USD/ARS).
- **Project Detail Pages**: Dedicated space for each project with session history and resource management.
- **Resources**: Save external links (GitHub, Figma, Docs) per project.

#### 2. Time Tracking
- Real-time timer with second precision.
- Ability to edit durations manually (HH:MM:SS format).
- **Session Details**: Slide-over panel (Drawer) for each session.
- **Notes & Attachments**: Support for long-form notes and file/image uploads (with Lightbox preview).

#### 3. Payment & Financials
- **Status Tracking**: Mark sessions as Paid/Pending.
- **Bulk Actions**: Floating action bar to settle multiple sessions at once.
- **Dashboard Stats**: Earnings breakdown by status and currency (USD/ARS).
- **Localization**: Argentine Pesos (ARS) formatted without decimals.

#### 4. Architecture & Persistence
- Built with **Next.js 16** (App Router) and **Tailwind CSS**.
- State management via **Zustand** with local persistence.
- Automatic Date revival and store migrations (Current version: v4).
- Comprehensive documentation in the `openspec/` directory.

## Getting Started

```bash
npm install
npm run dev
```

## Next Steps
- Implement user authentication.
- Cloud synchronization for project data.
- Advanced reporting and charts.
