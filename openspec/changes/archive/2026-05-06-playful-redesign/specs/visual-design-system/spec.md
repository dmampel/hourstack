## ADDED Requirements

### Requirement: Design Tokens
The system SHALL expose a documented set of design tokens (color, typography, radius, shadow, gradient) defined in `src/app/globals.css` via the Tailwind v4 `@theme` directive, and consumable from any component via Tailwind utilities or CSS variables.

The token surface MUST include at minimum:
- Surface colors: `--color-canvas`, `--color-surface`, `--color-surface-muted`, `--color-ink`, `--color-ink-soft`, `--color-line`.
- Accent colors: `--color-grape`, `--color-tangerine`, `--color-lime`, `--color-blush`, `--color-sky`.
- Brand gradient: `--gradient-brand`.
- Radius scale: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`.
- Shadow scale: `--shadow-soft`, `--shadow-pop`.
- Typography: heading font (`Fraunces`) and body font (`Geist Sans`) with a documented size scale.

#### Scenario: Token consumed by a component
- **GIVEN** a component renders with `bg-[var(--color-surface)]` or its mapped Tailwind token
- **WHEN** the page is opened in the browser
- **THEN** the rendered background MUST be exactly `#FFFFFF` (or the documented value), with no fallback to the prior zinc palette

#### Scenario: Single source of truth
- **WHEN** a developer changes `--color-grape` in `globals.css`
- **THEN** every surface that references the grape token (sidebar active state, primary Button, focus rings) MUST reflect the new value with no further code edits

### Requirement: Sidebar Navigation Shell
The system SHALL render a left-aligned vertical `Sidebar` as the primary navigation surface at `md` breakpoint and above, replacing the previous top `Nav`.

The sidebar MUST contain:
- A brand logo using `Fraunces` and the `--gradient-brand` clipped to the text.
- Navigation links to `Dashboard` (`/dashboard`) and `Projects` (`/projects`), each rendered with a lucide icon and a text label.
- An active-state treatment using `--color-grape` as a tinted background and a 4-px left accent bar on the active item.

#### Scenario: Active route highlighted
- **GIVEN** the user is on `/dashboard`
- **WHEN** the sidebar renders
- **THEN** the `Dashboard` item MUST display the active background tint and the 4-px accent bar
- **AND** the `Projects` item MUST NOT display either treatment

#### Scenario: Sidebar replaces top nav at md+
- **GIVEN** the viewport width is at least `768px`
- **WHEN** any page in the app is rendered
- **THEN** the previous top `Nav` MUST NOT appear
- **AND** the sidebar MUST be visible at the left edge with width `240px`

#### Scenario: Mobile bottom-bar fallback
- **GIVEN** the viewport width is below `768px`
- **WHEN** any page in the app is rendered
- **THEN** the sidebar MUST be replaced by a bottom navigation bar containing the same `Dashboard` and `Projects` items as icons
- **AND** the main content MUST occupy the full viewport width

### Requirement: Reusable UI Primitives
The system SHALL provide reusable UI primitive components under `src/components/ui/` so that visual conventions are centralized and consistent across pages.

The following primitives MUST exist with a documented prop API:
- `Card` with `tone`, `accent`, `padding` props.
- `Button` with `variant` (`primary` | `secondary` | `ghost`) and `size` (`sm` | `md` | `lg`) props.
- `IconButton` for icon-only actions, with an accessible label via `title` or `aria-label`.
- `Badge` with `tone` prop tied to the accent palette.

#### Scenario: Card primitive used on dashboard
- **WHEN** the dashboard sessions panel renders
- **THEN** it MUST be wrapped in `<Card>` (not an ad-hoc `<div className="rounded-2xl border ...">`)

#### Scenario: Button primitive used by Timer
- **WHEN** the Timer renders its Start/Stop control
- **THEN** the control MUST be the shared `<Button variant="primary">` (not an ad-hoc `<button class="bg-indigo-600 ...">`)

### Requirement: Iconography Source
The system SHALL use `lucide-react` as the single source of icons for navigation, controls, and content actions.

#### Scenario: Sidebar icons come from lucide
- **WHEN** the sidebar renders
- **THEN** the `Dashboard` icon MUST be `LayoutDashboard` and the `Projects` icon MUST be `FolderKanban`, both imported from `lucide-react`

### Requirement: Responsive Behavior
The visual system SHALL adapt to three breakpoints with documented behavior at each.

- **Mobile (`< 768px`)**: bottom-bar navigation; stats grid collapses to 1 column; Timer hero stacks digits above controls.
- **Tablet (`768–1023px`)**: sidebar is present (icon rail or full); stats grid uses 2 columns.
- **Desktop (`≥ 1024px`)**: full 240-px sidebar; stats grid uses 4 columns; Timer hero is full-width with digits and controls in one row.

#### Scenario: Stats grid at desktop
- **GIVEN** viewport width is `1280px`
- **WHEN** the dashboard renders
- **THEN** the four stat cards MUST appear in a single row of 4 equal columns

#### Scenario: Stats grid at mobile
- **GIVEN** viewport width is `375px`
- **WHEN** the dashboard renders
- **THEN** the four stat cards MUST stack vertically in a single column
