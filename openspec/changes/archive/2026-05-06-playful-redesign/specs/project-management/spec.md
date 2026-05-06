## ADDED Requirements

### Requirement: Project Tile Color Identity
The project list SHALL render each project as a tile whose background is a soft tint derived from that project's `color`.

The tint MUST be computed via `color-mix(in srgb, var(--project-color) 14%, var(--color-surface))` (or an equivalent approach yielding the same 14% mix) so all tiles read as harmonious regardless of the underlying color.

#### Scenario: Tinted tile background
- **GIVEN** a project with `color: "#FF7AB6"`
- **WHEN** the project list renders the tile
- **THEN** the tile background MUST be a 14% mix of `#FF7AB6` into the surface color (not pure white and not pure `#FF7AB6`)

#### Scenario: Title typography on tile
- **WHEN** a project tile renders its name
- **THEN** the name MUST be rendered using the `Fraunces` heading font

#### Scenario: Hover affordance
- **WHEN** the user hovers a project tile on a pointer device
- **THEN** the tile MUST display the `--shadow-pop` shadow and lift visually (translateY)

### Requirement: Project Form Visual Consistency
The project create/edit form SHALL adopt the new design system: inputs use `--radius-md`, focus rings use `--color-grape`, and the color picker swatches MUST be 40-px circles.

#### Scenario: Input focus ring
- **WHEN** the user focuses any text input in the project form
- **THEN** the input MUST display a focus ring in `--color-grape`

#### Scenario: Color swatch size
- **WHEN** the project form renders the color picker
- **THEN** each color swatch MUST be a circular target of 40 px in width and height

### Requirement: Project Detail Hero Strip
The project detail page SHALL open with a hero strip whose background is a tint of that project's `color`, displaying the project name (Fraunces), client (if any), and a `Badge` showing currency and hourly rate.

#### Scenario: Hero strip tint matches project color
- **GIVEN** a project with `color: "#4CC9F0"`
- **WHEN** the user navigates to `/projects/[id]` for that project
- **THEN** the hero strip background MUST be a tinted derivative of `#4CC9F0` (consistent with the tile tinting rule)

### Requirement: Resource Chips
The resources section SHALL render each external resource as a `Badge`-style chip containing a link icon (lucide `Link`) and the resource label, opening the URL in a new tab on click.

#### Scenario: Resource chip click opens new tab
- **GIVEN** a resource with `url: "https://github.com/foo/bar"` and `label: "GitHub"`
- **WHEN** the user clicks the chip
- **THEN** the URL MUST open in a new browser tab (target `_blank`, `rel="noopener noreferrer"`)

## MODIFIED Requirements

### Requirement: Project Creation & Editing
The system MUST allow users to create and modify projects.
- `name`: string (Required)
- `client`: string (Optional)
- `hourlyRate`: number (Required)
- `currency`: 'ARS' | 'USD' (Required)
- `color`: string (Required) — drives the tile/hero tint and session-row accent throughout the UI.
- `resources`: Resource[] (list of external links)

#### Scenario: Create with required fields
- **GIVEN** the user opens the project form
- **WHEN** they fill `name`, `hourlyRate`, `currency`, and `color`, then submit
- **THEN** the project MUST be persisted with those values
- **AND** the new project's tile MUST appear in the list using the chosen color as its tint source

### Requirement: Project Detail View
Each project MUST have a dedicated detail page.
- **Route**: Accessible at `/projects/[id]`.
- **Hero**: MUST display a tinted hero strip in the project's color with name (Fraunces), optional client, and a `Badge` for hourly rate + currency.
- **Filtered History**: MUST show all sessions belonging to that project.
- **Project Stats**: MUST display aggregated time and earnings (Paid/Pending) for that specific project, rendered inside `Card`s with tabular numerals.

#### Scenario: Detail page renders hero + sections
- **GIVEN** a project with id `abc`
- **WHEN** the user navigates to `/projects/abc`
- **THEN** the page MUST render the hero strip, the stats cards, the sessions list, and the resources section in that vertical order
