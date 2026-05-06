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

#### Scenario: Stop and Stop Accumulating
- GIVEN an active timer
- WHEN the user clicks "Stop"
- THEN the timer MUST stop incrementing immediately
- AND the system MUST prompt for a description to save the session
