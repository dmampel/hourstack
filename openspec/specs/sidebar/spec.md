# Sidebar Specification

## Purpose
Provides navigation, active timer control, and user profile information.

## Requirements

### Requirement: Navigation and Control
The Sidebar MUST provide links to Dashboard and Projects, and host the active Timer widget.

### Requirement: User Profile Footer
The Sidebar MUST include a fixed footer at the bottom containing the user's name, a profile placeholder, and access to settings.

#### Scenario: Footer placement
- GIVEN the Sidebar is rendered on desktop
- THEN the User Footer MUST be stuck to the bottom of the sidebar using `mt-auto` or absolute positioning within the flex container.

#### Scenario: Navigation links
- GIVEN the current route matches a navigation item
- THEN that item MUST be visually highlighted as active.
