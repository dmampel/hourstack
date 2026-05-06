# Dashboard Specification

## Purpose
Provides a summary of projects, sessions, and financial statistics.

## Requirements

### Requirement: Stats Summary (Format)
The system MUST display duration using the `HH:MM:SS` format (or `Xh Ym Zs`) in all summary cards and tables.

#### Scenario: Display Today's Stats
- GIVEN sessions recorded today
- THEN the dashboard MUST show the sum of their durations and earnings using precise formatting
