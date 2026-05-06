# Session Management Specification

## Purpose
Handles the storage, calculation, and retrieval of work sessions.

## Requirements

### Requirement: Duration Calculation (Precision)
The system MUST calculate the duration of a session in **seconds** to ensure absolute precision.

#### Scenario: Calculate Duration in Seconds
- GIVEN a session with start time 10:00:00 and end time 10:00:05
- THEN the duration MUST be 5 seconds

### Requirement: Earnings Calculation (Precision)
The system MUST calculate earnings based on duration in **seconds** and project hourly rate.

#### Scenario: Calculate Earnings with Second Precision
- GIVEN a session of 3600 seconds (1 hour)
- AND a project hourly rate of $50
- THEN the earnings MUST be $50

### Requirement: Payment Management
Users MUST be able to track if a session has been paid.
- **Toggle Status**: Individual sessions can be toggled between Paid and Pending.
- **Bulk Action**: Multiple pending sessions can be marked as Paid at once.
- **Financial Stats**: Total earnings MUST be split into "Paid" and "Pending" categories on the dashboard.

### Requirement: Session Detail & Notes
The system MUST provide an expanded view for each session to manage extra information.
- **Drawer View**: A side panel MUST display detailed information when a session is selected.
- **Rich Notes**: Users MUST be able to save long-form text notes for each session.
- **Precise Timing**: The detail view MUST show exact start and end timestamps (second precision).

### Requirement: Attachment Management
Users MUST be able to attach evidence or resources to a session.
- **File Upload**: Support for images and documents.
- **Visual Preview**: Image attachments MUST show a thumbnail and allow full-size preview (Lightbox).
- **Persistence**: Attachments MUST be saved alongside the session data.
