# Weekly Goal Tracking Specification

## Purpose
Allows users to set a weekly work hour goal and visualize their progress toward it.

## Requirements

### Requirement: Weekly Goal Definition
The system MUST allow defining a weekly goal in hours (e.g., 40h). 
The default goal SHALL be 40 hours.

#### Scenario: Default goal
- GIVEN a new user session
- THEN the weekly goal MUST be set to 40 hours unless otherwise specified in the store.

### Requirement: Progress Visualization
The system MUST display a visual progress bar indicating the percentage of the weekly goal completed based on the total duration of sessions recorded in the current week (Monday to Sunday).

#### Scenario: Progress calculation
- GIVEN a weekly goal of 40 hours
- AND the user has worked 20 hours this week
- THEN the progress bar MUST be at 50%
- AND the label MUST show "20h / 40h".

#### Scenario: Over-achieving goal
- GIVEN the user has worked 45 hours this week with a 40h goal
- THEN the progress bar MUST be at 100% (filled)
- AND it MAY change color to indicate the goal has been met/exceeded.
