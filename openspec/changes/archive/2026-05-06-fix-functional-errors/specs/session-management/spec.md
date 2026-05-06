# Delta for Session Management

## MODIFIED Requirements

### Requirement: Duration Calculation (Precision)
The system MUST calculate the duration of a session in **seconds** to ensure absolute precision.
(Previously: Duration was calculated in minutes).

#### Scenario: Calculate Duration in Seconds
- GIVEN a session with start time 10:00:00 and end time 10:00:05
- THEN the duration MUST be 5 seconds

### Requirement: Earnings Calculation (Precision)
The system MUST calculate earnings based on duration in **seconds** and project hourly rate.
(Previously: Calculated using minutes).

#### Scenario: Calculate Earnings with Second Precision
- GIVEN a session of 3600 seconds (1 hour)
- AND a project hourly rate of $50
- THEN the earnings MUST be $50
