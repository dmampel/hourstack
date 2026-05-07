# Delta for Dashboard

## MODIFIED Requirements

### Requirement: Timer Hero Presentation
The Timer SHALL NOT be the primary hero of the dashboard. Instead, the Dashboard MUST prioritize the Stats Summary at the top.
(Previously: The Timer SHALL be presented as the hero element of the dashboard, occupying full content width above the stats grid.)

#### Scenario: Hero placement on desktop
- **GIVEN** the user is on `/dashboard` at viewport ≥ 1024px
- **THEN** the Stats Summary (4-chip grid) MUST be the first content block under the page header.
(Previously: THEN the Timer hero MUST be the first content block under the page header)

### Requirement: Dashboard Grid Layout
The Dashboard content (below the summary) MUST follow a multi-column grid layout on large screens.

#### Scenario: Two-column distribution
- **GIVEN** a viewport ≥ 1024px
- **THEN** the Session List MUST occupy 2/3 of the width.
- **AND** the Earnings Overview and By Project table MUST occupy 1/3 of the width.
