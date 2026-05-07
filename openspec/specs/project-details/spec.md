# Spec: Project Details Page

## Requirements

### Requirement: Dynamic Routing
The system MUST provide a dedicated page for each project using its unique ID.

#### Scenario: View Project Details
- **GIVEN** a project with ID `123` exists
- **WHEN** the user navigates to `/projects/123`
- **THEN** the page MUST display the name and client of that project.

### Requirement: Filtered Stats
The system MUST calculate and display stats filtered exclusively by the project ID.

#### Scenario: Earnings Calculation
- **GIVEN** Project A has 2 sessions of 1 hour each at $50/hr
- **AND** Project B has 1 session of 1 hour at $100/hr
- **WHEN** viewing Project A's details
- **THEN** the Total Earnings MUST show $100.

### Requirement: External Resources
The system MUST allow managing external links associated with the project.

#### Scenario: Add Resource
- **GIVEN** the user is on a Project Detail page
- **WHEN** the user adds a link "Design" with URL "figma.com/..."
- **THEN** the link MUST appear in the Resources section.
- **AND** it MUST be stored in the project's `resources` array.

### Requirement: Navigation Links
All project visual representations (cards, dock avatars) MUST act as links to the Project Detail page.
