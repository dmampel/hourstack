# Delta for Timer

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Stop and Save
The system MUST allow stopping the timer and saving the session. When stopped, the timer MUST immediately stop accumulating time.
(Previously: Clicking "Stop" only opened the save form while the timer continued).

#### Scenario: Stop and Stop Accumulating
- GIVEN an active timer
- WHEN the user clicks "Stop"
- THEN the timer MUST stop incrementing immediately
- AND the system MUST prompt for a description to save the session
