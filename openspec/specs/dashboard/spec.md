# Dashboard Specification

## Purpose
Provides a summary of projects, sessions, and financial statistics.

## Requirements

### Requirement: Stats Summary (Format)
The system MUST display duration using the `HH:MM:SS` format (or `Xh Ym Zs`) in all summary cards and tables.

#### Scenario: Display Today's Stats
- GIVEN sessions recorded today
- THEN the dashboard MUST show the sum of their durations and earnings using precise formatting

### Requirement: Dashboard Header & Project Dock
The Dashboard MUST feature a header area with a macOS-style Project Dock and a partitioned summary of key metrics.

#### Scenario: Project Dock presentation
- **GIVEN** at least one project exists
- **THEN** the Dashboard MUST show a horizontal dock of project avatars with springy hover animations and initials.
- **AND** there MUST be an "Add Project" placeholder at the end of the dock.

### Requirement: Partitioned Metrics
Primary highlights (e.g., Top Project, Average Session Time) MUST be rendered as partitioned chips (flush against each other) to create a unified visual block.

### Requirement: Dashboard Grid Layout
The Dashboard content MUST follow a complex grid layout on large screens to maximize information density without clutter.

#### Scenario: 4-column distribution
- **GIVEN** a viewport ≥ 1024px
- **THEN** the Header area MUST be split into a 3/4 Highlight section and a 1/4 Mini-chip stack.
- **AND** the Main Content area MUST follow a 2/3 (Session List) and 1/3 (Balances & Project Table) split.

### Requirement: Financial Breakdowns
Summary cards that display earnings MUST show a breakdown by currency (e.g., USD and ARS) if sessions in different currencies exist.
