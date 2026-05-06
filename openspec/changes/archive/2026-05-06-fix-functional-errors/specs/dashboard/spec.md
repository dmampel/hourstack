# Delta for Dashboard

## MODIFIED Requirements

### Requirement: Stats Summary (Format)
The system MUST display duration using the `HH:MM:SS` format in all summary cards and tables.
(Previously: Displayed in `Xh Ym` format).

#### Scenario: Display Precise Duration
- GIVEN a total duration of 3665 seconds
- THEN the dashboard MUST show `01:01:05`
