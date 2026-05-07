# Timer Specification

## Purpose
Core time tracking capability allowing users to record real-time work sessions.

## Requirements

### Requirement: Real-time Counting
The system MUST display an incrementing timer while active.

#### Scenario: Timer Ticks
- GIVEN an active timer
- WHEN 1 second passes
- THEN the displayed time MUST increment by 1 second

### Requirement: Pause and Resume
The system MUST allow pausing and resuming an active timer.

#### Scenario: Pause Timer
- GIVEN an active timer
- WHEN the user clicks "Pause"
- THEN the timer MUST stop incrementing visually
- AND the accumulated time MUST be stored as `elapsedTime`

#### Scenario: Resume Timer
- GIVEN a paused timer
- WHEN the user clicks "Resume"
- THEN the timer MUST start incrementing again from the stored `elapsedTime`

### Requirement: Start and Stop
The system MUST allow starting and stopping the timer. When stopped, the timer MUST immediately stop accumulating time.

#### Scenario: Start Timer
- GIVEN the timer is idle
- WHEN the user selects a project and clicks "Start"
- THEN an active timer MUST be created with the current timestamp

#### Scenario: Finish Session
- GIVEN an active timer
- WHEN the user clicks "Finish"
- THEN the timer MUST stop incrementing immediately
- AND the system MUST prompt for a description to save the session

### Requirement: Reset Timer
The system MUST allow resetting an active or paused timer to zero without saving a session.

#### Scenario: Reset Timer
- GIVEN an active or paused timer
- WHEN the user clicks the "Reset" (RotateCcw) icon
- THEN the `elapsedTime` MUST be set to 0
- AND the `startTime` MUST be reset to the current time (if active) or null (if paused)

### Requirement: Decoupled UI
The Timer UI MUST separate the visual time display (Card) from the interaction controls (Buttons) to improve visual clarity.
- The Card MUST focus exclusively on displaying the current duration and active project.
- The Controls MUST be positioned outside the card and provide clear actions for Start, Pause/Resume, Finish, and Reset.
