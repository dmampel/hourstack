## ADDED Requirements

### Requirement: Timer Hero Presentation
The Timer SHALL be presented as the hero element of the dashboard, occupying full content width above the stats grid.

The Timer hero MUST:
- Use `--gradient-brand` as its background.
- Display the running duration in a large display-size typography (token `--text-display`) with `font-variant-numeric: tabular-nums` so digits do not jitter.
- Group its primary control (Start / Stop) and project selector inside a glassmorphism inner surface that uses `backdrop-filter: blur(20px)` with a translucent fallback for browsers that do not support backdrop filters.

#### Scenario: Hero placement on desktop
- **GIVEN** the user is on `/dashboard` at viewport ≥ 1024px
- **THEN** the Timer hero MUST be the first content block under the page header
- **AND** it MUST occupy 100% of the main content width

#### Scenario: Backdrop filter fallback
- **GIVEN** a browser that does not support `backdrop-filter`
- **WHEN** the Timer hero renders
- **THEN** the inner control surface MUST fall back to a flat translucent layer (no blur) without losing contrast for the controls

### Requirement: Stat Card Identity
Each summary stat (today total, today earnings, week total, week earnings) SHALL be rendered as its own `Card` styled with one of the five accent colors from the design system, with a matching icon.

#### Scenario: Distinct color per stat
- **WHEN** the dashboard renders the stats grid
- **THEN** the four stat cards MUST each use a different accent color from `{grape, tangerine, lime, blush, sky}`

#### Scenario: Numeric value emphasis
- **WHEN** a stat card renders its value
- **THEN** the numeric value MUST use the `--text-h1` size and `font-variant-numeric: tabular-nums`

### Requirement: Session List Visual Treatment
The recent-sessions list SHALL render as rows inside a `Card`, each row carrying a visible reference to its project's `color`.

#### Scenario: Project color on session row
- **WHEN** a session row renders
- **THEN** it MUST display either a 6-px left accent bar OR an 8-px dot in the project's `color`

#### Scenario: Hover lift
- **WHEN** the user hovers a session row on a pointer device
- **THEN** the row MUST visually lift (subtle shadow or transform) to indicate interactivity

## MODIFIED Requirements

### Requirement: Stats Summary (Format)
The system MUST display duration using the `HH:MM:SS` format (or `Xh Ym Zs`) in all summary cards and tables, rendered with `font-variant-numeric: tabular-nums` so digit width does not jitter as time advances.

#### Scenario: Display Today's Stats
- GIVEN sessions recorded today
- THEN the dashboard MUST show the sum of their durations and earnings using precise formatting
- AND the numeric display MUST use tabular numerals so figures stay aligned across rows
