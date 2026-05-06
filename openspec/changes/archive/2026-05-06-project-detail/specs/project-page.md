# Specification: Project Detail Page

## Requirements

### Requirement: Navigation to Project Detail
The user MUST be able to access the project detail page from multiple points.

#### Scenario: Access from Dashboard
- GIVEN the dashboard session list
- WHEN the user clicks on a project name/badge
- THEN the system MUST navigate to `/projects/[id]`.

#### Scenario: Access from Projects List
- GIVEN the `/projects` page
- WHEN the user clicks on a project card/row
- THEN the system MUST navigate to `/projects/[id]`.

### Requirement: Project Resources
The user MUST be able to store and access external links for each project.

#### Scenario: Add Resource
- GIVEN the project detail page
- WHEN the user provides a label and a URL
- THEN a new link MUST be saved and displayed in the Resources section.

### Requirement: Filtered Session History
The project detail page MUST show all sessions associated with that project.

#### Scenario: View Sessions
- GIVEN the project detail page for Project A
- THEN only sessions with `projectId === Project A.id` MUST be displayed.
- AND the summary stats (total hours, paid/pending) MUST reflect only these sessions.
