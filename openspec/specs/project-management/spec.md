# Project Management Specification

## Purpose
Manage project entities, their financial settings, and associated resources.

## Requirements

### Requirement: Project Creation & Editing
The system MUST allow users to create and modify projects.
- `name`: string (Required)
- `client`: string (Optional)
- `hourlyRate`: number (Required)
- `currency`: 'ARS' | 'USD' (Required)
- `resources`: Resource[] (list of external links)

### Requirement: Project Detail View
Each project MUST have a dedicated detail page.
- **Route**: Accessible at `/projects/[id]`.
- **Filtered History**: MUST show all sessions belonging to that project.
- **Project Stats**: MUST display aggregated time and earnings (Paid/Pending) for that specific project.

### Requirement: Resource Management
Users MUST be able to manage external resources for each project.
- **Links**: Ability to add/remove URLs with descriptive labels (e.g., GitHub, Figma).
- **Persistence**: Resources MUST be saved within the project object.
