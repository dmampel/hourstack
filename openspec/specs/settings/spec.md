# Spec: Settings Page

## Requirements

### Requirement: User Profile Configuration
The system MUST allow the user to update their personal information.

#### Scenario: Update name and goal
- **GIVEN** the user is on `/settings`
- **WHEN** the user changes the name to "Juan" and the weekly goal to 30
- **AND** clicks "Save"
- **THEN** the Dashboard greeting MUST show "Welcome back, Juan!"
- **AND** the Sidebar weekly progress MUST calculate percentages based on 30 hours.

### Requirement: Global Defaults
The system SHOULD allow setting a default currency for new projects.

### Requirement: Data Portability (Export)
The system MUST allow the user to download a JSON file containing all their data (projects and sessions).

#### Scenario: Backup data
- **WHEN** the user clicks "Export Backup"
- **THEN** a `.json` file MUST be downloaded with the current store state.

### Requirement: Danger Zone (Reset)
The system MUST provide a way to delete all data with a high-friction confirmation.

#### Scenario: Clear all data
- **WHEN** the user clicks "Reset All Data"
- **AND** confirms the destructive action
- **THEN** the store MUST be cleared (including localStorage).
- **AND** the app MUST redirect to the dashboard.
