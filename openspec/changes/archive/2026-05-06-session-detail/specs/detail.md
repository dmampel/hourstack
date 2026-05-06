# Specification: Session Detail & Attachments

## Requirements

### Requirement: Session Detail Panel (Drawer)
The system MUST provide a dedicated space to view and edit session details without leaving the current view.

#### Scenario: Open Detail Panel
- GIVEN the session list
- WHEN the user clicks on a session item (outside of the checkbox/delete areas)
- THEN a panel MUST slide in from the right containing the session's full data.

### Requirement: Session Notes
The user MUST be able to add and edit long-form notes for each session.

#### Scenario: Edit Notes
- GIVEN the detail panel is open
- WHEN the user types in the notes field
- THEN the changes MUST be persisted to the session record.

### Requirement: Attachment Management
The system MUST support attaching files and screenshots to a session.

#### Scenario: Upload Attachment
- GIVEN the detail panel is open
- WHEN the user selects a file
- THEN the file MUST be stored (locally for now) and associated with the session.
- AND a thumbnail or file icon MUST be displayed in the panel.

### Requirement: Precise Timestamps
The detail panel MUST display the exact start and end times of the session.

#### Scenario: View Timestamps
- GIVEN the detail panel is open
- THEN it MUST show:
  - Start: `h:mm:ss aaaa`
  - End: `h:mm:ss aaaa`
  - Date: `d MMM, yyyy`
