## Why

Hourstack works but feels sterile: a generic top nav, white surfaces, zinc borders, and a single indigo accent make the app forgettable. For a freelancer-facing time tracker the user opens many times per day, the interface should feel energetic, friendly, and distinctive — "una bombineta". This change introduces a playful, colorful visual system that turns the dashboard into a hero experience and the navigation into a permanent piece of brand.

## What Changes

- **NEW** Introduce a `visual-design-system` capability: design tokens (color palette, typography scale, radius, shadows, gradients) wired into Tailwind v4 via `@theme` in `globals.css`.
- **BREAKING** Replace the top `Nav` (`src/components/ui/Nav.tsx`) with a left vertical `Sidebar` component (icon + label, active state with color, gradient logo). Root layout shifts from stacked to a 2-column grid.
- Refresh the dashboard:
  - Promote `Timer` to a hero card with a vibrant gradient background, oversized digit display, and expressive control buttons.
  - Restyle `Stats` cards: each stat in its own colored "chip" card with soft glassmorphism, larger numbers, descriptive labels.
  - Restyle `SessionList` rows: rounded surfaces, project color dot, hover lift.
- Refresh project surfaces:
  - `ProjectList` cards become colored tiles (using each project's `color` field) with playful radius and shadow.
  - `ProjectForm` inputs get the new token system (rounded-2xl, focus rings in accent colors).
  - Project detail page (`src/app/projects/[id]/page.tsx`) and `ResourcesSection` adopt the same surface system.
- Add a small set of shared UI primitives under `src/components/ui/` (Card, Button, IconButton, Badge) so the new visual language is reusable and consistent.
- Add `lucide-react` (or inline SVGs — decided in design) for sidebar icons and timer controls.

NOT changing: business logic, Zustand store (`src/store/useAppStore.ts`), `src/types/index.ts`, `src/lib/utils.ts`, `src/lib/csv.ts`. This is a UI-only refresh.

## Capabilities

### New Capabilities
- `visual-design-system`: Design tokens (color palette, typography, spacing, radius, shadows, gradients), the shared `Sidebar` shell, and reusable UI primitives (Card, Button, IconButton, Badge) that the rest of the app composes.

### Modified Capabilities
- `dashboard`: Visual presentation requirements change — Timer becomes a hero element, stats are presented as expressive colored cards, layout adapts to the new sidebar shell.
- `project-management`: Visual presentation requirements change — project list/detail use colored tiles driven by each project's `color`, forms adopt the new input style.

> `timer` and `session-management` capabilities keep their behavioral specs unchanged; they are restyled but their requirements (start/stop/persist sessions) are not modified.

## Impact

- **Code (modified)**:
  - `src/app/layout.tsx` — switch from top-nav stack to sidebar grid layout.
  - `src/app/globals.css` — extended `@theme` block with new design tokens.
  - `src/app/dashboard/page.tsx` — restructured grid to feature Timer as hero.
  - `src/app/projects/page.tsx`, `src/app/projects/[id]/page.tsx` — adopt new surfaces.
  - `src/components/ui/Nav.tsx` — REPLACED by `src/components/ui/Sidebar.tsx`.
  - `src/components/features/sessions/Timer.tsx` — restyled hero variant.
  - `src/components/features/sessions/SessionList.tsx`, `SessionDrawer.tsx` — restyled.
  - `src/components/features/dashboard/Stats.tsx` — restyled colored cards.
  - `src/components/features/projects/ProjectList.tsx`, `ProjectForm.tsx`, `ResourcesSection.tsx` — restyled.
- **Code (new)**:
  - `src/components/ui/Sidebar.tsx`
  - `src/components/ui/Card.tsx`, `Button.tsx`, `IconButton.tsx`, `Badge.tsx`
- **Dependencies**: add `lucide-react` for icons.
- **APIs / data**: none — store, types, and persistence unchanged.
- **Breaking**: any consumer of `Nav` is removed; `RootLayout` markup changes (visual only, no route impact).
- **Risk**: low — purely presentational. Manual verification in browser per project convention (no test runner).
