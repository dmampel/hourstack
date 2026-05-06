## 1. Foundation — Design tokens & dependencies

- [x] 1.1 Add `lucide-react` to `package.json` dependencies and install.
- [x] 1.2 Load `Fraunces` (variable, weight 600) via `next/font/google` in `src/app/layout.tsx` with `display: 'swap'` and expose as a CSS variable (e.g., `--font-fraunces`).
- [x] 1.3 Extend the `@theme` block in `src/app/globals.css` with surface tokens: `--color-canvas`, `--color-surface`, `--color-surface-muted`, `--color-ink`, `--color-ink-soft`, `--color-line`.
- [x] 1.4 Extend the `@theme` block with accent tokens: `--color-grape`, `--color-tangerine`, `--color-lime`, `--color-blush`, `--color-sky` (exact hex values from `design.md` §1).
- [x] 1.5 Add `--gradient-brand` as a CSS variable in `globals.css` (used by logo + Timer hero).
- [x] 1.6 Add radius tokens (`--radius-sm/md/lg/xl`) and shadow tokens (`--shadow-soft`, `--shadow-pop`) to the `@theme` block.
- [x] 1.7 Add typography size tokens (`--text-display`, `--text-h1`, `--text-h2`, `--text-body`, `--text-small`) and a utility/`@layer base` rule that maps `Fraunces` to headings and `Geist Sans` to body.
- [x] 1.8 Switch `body` background in `globals.css` from white/`zinc` to `var(--color-canvas)` and base text color to `var(--color-ink)`.

## 2. Foundation — UI primitives

- [x] 2.1 Create `src/components/ui/Card.tsx` with props `tone?: 'plain' | 'tinted'`, `accent?: string`, `padding?: 'sm' | 'md' | 'lg'`, `as?` (default `<div>`); applies `--radius-lg` and `--shadow-soft`.
- [x] 2.2 Create `src/components/ui/Button.tsx` with `variant: 'primary' | 'secondary' | 'ghost'` and `size: 'sm' | 'md' | 'lg'`; primary uses `--color-grape`, secondary uses border + ink text, ghost is transparent.
- [x] 2.3 Create `src/components/ui/IconButton.tsx` (square button for icon-only actions) with required `aria-label`.
- [x] 2.4 Create `src/components/ui/Badge.tsx` with `tone` prop mapped to the accent palette and a currency helper (ARS → blush, USD → lime).
- [x] 2.5 Sanity-pass: `bun run build` succeeds; new primitives exported and unused for now (no visual change yet).

## 3. Implementation — Sidebar shell

- [x] 3.1 Create `src/components/ui/Sidebar.tsx`: 240-px fixed-width column at `md+`, vertical layout (logo / nav / footer slot).
- [x] 3.2 Brand logo in the sidebar: "Hourstack" rendered in `Fraunces` with `--gradient-brand` clipped via `background-clip: text`.
- [x] 3.3 Sidebar nav items for `Dashboard` (`LayoutDashboard` icon) and `Projects` (`FolderKanban` icon); active state uses `--color-grape` background tint + 4-px left accent bar (use `usePathname`).
- [x] 3.4 Mobile fallback: under `md`, the sidebar renders as a fixed bottom bar with the same two items as icons; main content goes full-width.
- [x] 3.5 Tablet behavior (optional, ship if cheap): collapse the sidebar to a 64-px icon rail between `md` and `lg`.

## 4. Implementation — Layout shell swap

- [x] 4.1 Update `src/app/layout.tsx`: remove `<Nav />`, render `<Sidebar />` and a 2-column grid (`grid-cols-[240px_1fr]` at `md+`, `grid-cols-1` below).
- [x] 4.2 Wrap main content in a max-width container (e.g., `max-w-[1200px]`) with `p-8` padding.
- [x] 4.3 Delete `src/components/ui/Nav.tsx` and remove any remaining imports.
- [x] 4.4 Manual check in browser at `< 768`, `768–1024`, `≥ 1024`: layout renders correctly, no overflow, active state lights up on the right item per route.

## 5. Implementation — Dashboard

- [x] 5.1 Restyle `src/components/features/sessions/Timer.tsx` as the hero variant: full-width container with `--gradient-brand` background, glassmorphism inner card (`backdrop-filter: blur(20px)` + `@supports` fallback), digits use `--text-display` and `tabular-nums`.
- [x] 5.2 Replace Timer's Start/Stop button with the shared `<Button variant="primary" size="lg">`; project selector picks up the new input style.
- [x] 5.3 Restyle `src/components/features/dashboard/Stats.tsx`: 4 colored chip-cards (grape / tangerine / lime / sky), each with a lucide icon, label, and large value (`--text-h1`, `tabular-nums`); responsive grid (4 → 2 → 1 cols).
- [x] 5.4 Restyle `src/components/features/sessions/SessionList.tsx`: wrap in `<Card>`, each row gets a 6-px left accent bar OR an 8-px dot in `project.color`, plus hover lift via shadow + translateY.
- [x] 5.5 Restyle `src/components/features/sessions/SessionDrawer.tsx` to match the new surface system (rounded `--radius-lg`, `--shadow-pop`, `IconButton` for close).
- [x] 5.6 Update `src/app/dashboard/page.tsx` composition: Timer hero → Stats grid → Session list (per `design.md` §5).

## 6. Implementation — Projects pages

- [x] 6.1 Restyle `src/components/features/projects/ProjectList.tsx`: responsive grid of project tiles; each tile background uses `color-mix(in srgb, var(--project-color) 14%, var(--color-surface))`, name in `Fraunces`, hover triggers `--shadow-pop` + translateY; rate + currency rendered as `<Badge>`.
- [x] 6.2 Restyle `src/components/features/projects/ProjectForm.tsx`: inputs use `--radius-md` and `--color-grape` focus ring; color picker swatches enlarged to 40-px circles; submit uses `<Button variant="primary">`.
- [x] 6.3 Update `src/app/projects/page.tsx` page header (title in `Fraunces`, action button uses primitive).
- [x] 6.4 Update `src/app/projects/[id]/page.tsx`: add hero strip tinted with the project's color, name in `Fraunces`, currency + rate as a `<Badge>`; sections wrapped in `<Card>`.
- [x] 6.5 Restyle `src/components/features/projects/ResourcesSection.tsx`: each resource as a chip (Badge-style) with the lucide `Link` icon; "Add" action uses `<IconButton>` with the `Plus` icon.

## 7. Integration — Verification & polish

- [x] 7.1 Run `bun run lint` (or `npm run lint`) and resolve any new warnings.
- [x] 7.2 Run `bun run build` (or `npm run build`) and confirm the production build succeeds.
- [ ] 7.3 Manual browser pass at `375 px`, `768 px`, `1280 px`: navigate Dashboard ↔ Projects ↔ Project detail; verify sidebar/bottom-bar swap, Timer hero readability, stats grid columns, project tile tints.
- [ ] 7.4 Exercise Timer (start, stop, switch project) and confirm digits stay aligned (tabular-nums) and no layout shift on the hero.
- [ ] 7.5 Open a project detail page and confirm the hero strip color matches the tile color used in the list.
- [ ] 7.6 Search the repo for stale class names that should have been migrated: `border-zinc-200`, `bg-white`, `text-indigo-600`. Either replace with token equivalents or document why they remain.
- [ ] 7.7 Self-review: every place that previously rendered an ad-hoc card/button now uses the shared `Card` / `Button` / `IconButton` / `Badge` primitives; no leaked instances.
