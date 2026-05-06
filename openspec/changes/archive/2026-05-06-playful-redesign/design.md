## Context

Hourstack today uses Tailwind v4 (`@theme inline` in `globals.css`), a top `Nav` shell rendered from `RootLayout`, and pages composed from feature components under `src/components/features/`. The visual language is white-and-zinc with a single indigo accent — neutral but personality-free. The goal is a **playful, colorful, energetic** redesign that keeps every business behavior identical and only changes presentation.

Constraints we must respect:
- Tailwind v4 `@theme` token system (no `tailwind.config.ts`).
- Next.js 15 App Router, React 19, Zustand 5 — no architectural changes.
- No test runner exists (verification is manual in browser per `config.yaml`).
- Project entities already carry a `color` field — we lean on it heavily.

Stakeholders: the user (Delfina) is the sole consumer; this is a personal product where visual delight matters.

## Goals / Non-Goals

**Goals**
- Replace the top nav with a left **sidebar** that becomes the spine of the app.
- Establish a small but expressive **design token system** in `globals.css` (palette, typography, radius, shadow, gradients).
- Promote the **Timer** to a hero element on the dashboard — the first thing the eye lands on.
- Make **stats** and **project tiles** feel colorful, with each project's `color` driving its visual identity.
- Build 4 reusable UI primitives (`Card`, `Button`, `IconButton`, `Badge`) so the new look is consistent and cheap to extend.
- Stay responsive: collapses gracefully to a top-bar variant under `md`.

**Non-Goals**
- No changes to `useAppStore` actions, state shape, or persistence.
- No changes to `types/index.ts`, `lib/utils.ts`, or `lib/csv.ts`.
- No new routes, no new business features, no animation libraries (Framer Motion is out of scope).
- No dark mode in this change (tokens will be authored to make it possible later, but no toggle ships).
- No accessibility overhaul beyond preserving current contrast and adding focus rings.

## Decisions

### 1. Color palette: warm-pastel + vibrant accents

We adopt a bombineta-but-tasteful palette. Authored as Tailwind v4 tokens via `@theme` in `globals.css`.

**Background / surface**
- `--color-canvas: #FAF7F2` — warm off-white app background (replaces white).
- `--color-surface: #FFFFFF` — card surface.
- `--color-surface-muted: #F2EEE7` — secondary surface.
- `--color-ink: #1B1A22` — primary text (replaces zinc-900).
- `--color-ink-soft: #6B6776` — secondary text (replaces zinc-500/600).
- `--color-line: #ECE7DD` — soft divider (replaces zinc-200).

**Accent palette (5 vibrant + 1 brand gradient)**
- `--color-grape: #7C5CFF` — primary brand / sidebar active.
- `--color-tangerine: #FF8A4C` — warm accent (Timer hero).
- `--color-lime: #B8E986` — success / stats.
- `--color-blush: #FF7AB6` — playful accent.
- `--color-sky: #4CC9F0` — info accent.
- `--gradient-brand: linear-gradient(135deg, #7C5CFF 0%, #FF7AB6 50%, #FF8A4C 100%)` — logo + Timer hero background.

Project colors (existing `project.color`) keep their role; the new palette informs how we present them (we add a transparent tint helper: `color-mix(in srgb, var(--project-color) 12%, white)`).

**Why these choices**
- Warm canvas (`#FAF7F2`) immediately differentiates from the current sterile white.
- Grape (`#7C5CFF`) is bolder than the current indigo, reads as "playful tech" not "enterprise dashboard".
- Tangerine paired with Grape gives the brand its signature dual-tone for the gradient.
- Five accents (not three) so the dashboard stats grid doesn't repeat colors.

**Alternatives considered**
- Pure pastel-only palette → felt sleepy; rejected.
- Neon palette → too harsh on a long-session work app; rejected.
- Single accent + tints → not playful enough; rejected.

### 2. Typography

- Keep `Geist Sans` (already loaded in `layout.tsx`) as the body font.
- Add `Fraunces` (variable, Google Fonts) for headings — playful, slightly bouncy serif, free under SIL OFL. Loaded via `next/font/google`.
- Type scale tokens in `@theme`:
  - `--text-display: 4rem` (Timer digits — `Fraunces`, weight 600, optical size 144).
  - `--text-h1: 2.25rem` (page titles — `Fraunces`, weight 600).
  - `--text-h2: 1.5rem` (section headings — `Geist Sans`, weight 600).
  - `--text-body: 0.9375rem` / `--text-small: 0.8125rem`.
- Numeric/timer text uses `font-variant-numeric: tabular-nums` so digits don't jitter.

**Why**: a serif heading on a sans body is a cheap, high-impact way to feel distinctive without committing to a full custom typeface. Fraunces in particular has a friendly, slightly playful character.

**Alternative**: `Instrument Serif` — narrower/feels more editorial. Less playful. Rejected.

### 3. Radius, shadow, surfaces

- `--radius-sm: 10px`, `--radius-md: 16px`, `--radius-lg: 24px`, `--radius-xl: 32px`.
- Cards default to `--radius-lg` (24 px) — current `rounded-2xl` (16 px) feels tight for the new look.
- Shadows: layered, soft, slightly colored (not pure black).
  - `--shadow-soft: 0 1px 2px rgba(27,26,34,0.04), 0 8px 24px -8px rgba(27,26,34,0.08)`.
  - `--shadow-pop: 0 2px 4px rgba(124,92,255,0.10), 0 16px 40px -12px rgba(124,92,255,0.25)` (Timer hero, project tile hover).
- Glassmorphism: applied **only** on the Timer hero (over the gradient): `backdrop-filter: blur(20px); background: color-mix(in srgb, white 55%, transparent)`. Used sparingly to avoid the trendy-but-overused look.

### 4. Layout: sidebar shell

`RootLayout` becomes a 2-column grid:

- Sidebar fixed width: **240 px** at `md+`, collapses to a 64-px icon-only rail at `< lg` (optional — defer to phase 2 if time-pressed), and to a **bottom-bar** under `md`.
- Sidebar contents (top → bottom):
  1. Logo: "Hourstack" in `Fraunces` with `--gradient-brand` clipped to text.
  2. Primary nav: `Dashboard`, `Projects` — icon (lucide) + label, active state has `--color-grape` background tint and a 4-px left accent bar.
  3. Footer slot (reserved): user/version stub for future.
- Main content: max-width `1200 px`, padded `2rem`, vertically scrollable.

**Why a sidebar**: matches the references; provides a permanent brand surface; makes room for future top sections (Reports, Settings) without crowding.

**Why 240 px**: standard width that reads "real product", not "demo". Narrow enough not to steal canvas; wide enough for label + icon without truncation.

**Alternative considered**: keep top nav, just restyle. Rejected — sidebar is explicitly requested and is the strongest single move toward "feels like a real product".

### 5. Dashboard composition

New grid (desktop):
```
+-----------------------------------------------------+
| [    Timer hero (full-width, gradient bg)        ]  |
| [    HH:MM:SS huge | Project select | Start ]    |
+--------------------------+--------------------------+
| Today total | Today $ | Week total | Week $   |    | <- 4 stat chips
+--------------------------+--------------------------+
| [        Recent sessions list                  ]    |
+-----------------------------------------------------+
```

- Timer hero: ~280 px tall, `--gradient-brand` background, glassmorphism inner card holding the digit display + control row.
- Stats: 4 chip-cards in a 4-column grid (collapses to 2 on `md`, 1 on `sm`). Each chip uses one of the 5 accent colors as a tinted background and matches its icon color.
- Sessions list: card with `--shadow-soft`, rows have a hover lift and the project's color as a 6-px left bar + 8-px dot.

### 6. Project surfaces

- `ProjectList` becomes a responsive grid of project tiles. Tile background: `color-mix(in srgb, var(--project-color) 14%, var(--color-surface))`. Title in `Fraunces`. Hover: `--shadow-pop` and `transform: translateY(-2px)`. Rate + currency as a `Badge`.
- `ProjectForm` reuses the new primitives. Inputs: `--radius-md`, focus ring in `--color-grape`. Color picker keeps current swatches but enlarges them (40 px circles).
- `Project detail` page: header is a hero strip in the project's color tint, then sessions/resources sections inside `Card`s.
- `ResourcesSection`: each resource as a `Badge`-style chip with the link icon.

### 7. UI primitives

Created under `src/components/ui/`:

- `Card.tsx` — `<div>` wrapper. Props: `tone?: 'plain' | 'tinted'`, `accent?: string` (CSS color), `padding?: 'sm' | 'md' | 'lg'`, `as?: keyof JSX.IntrinsicElements`. Default: `tone="plain"`, `padding="md"`, `--radius-lg`, `--shadow-soft`.
- `Button.tsx` — variants: `primary` (grape solid), `secondary` (line border), `ghost` (transparent). Sizes: `sm | md | lg`. Always rounded `--radius-md`. Loading + disabled states.
- `IconButton.tsx` — square button for icon-only actions (sidebar collapse, drawer close). Tooltip via `title`.
- `Badge.tsx` — pill with `tone` prop tied to accent palette + `currency` helper that maps ARS→blush, USD→lime.

Why primitives now: today the codebase repeats `className="rounded-xl border border-zinc-200 ..."` everywhere. Centralizing prevents drift after the refresh.

### 8. Iconography

Add `lucide-react` (~30 KB tree-shaken, MIT). Use icons in: sidebar (`LayoutDashboard`, `FolderKanban`), Timer controls (`Play`, `Pause`, `Square`), session row (`MoreHorizontal`), resources (`Link`, `Plus`).

**Alternative**: hand-rolled SVGs — rejected, scales poorly across 8+ icons.

### 9. Responsive behavior

- `< 768 px` (mobile): sidebar collapses to a 64-px **bottom bar** with the same 2 nav items as icons. Main content goes full-width. Timer hero stacks (digits above controls).
- `768–1024 px` (tablet): sidebar stays as 64-px icon rail. Stats grid: 2 columns.
- `≥ 1024 px` (desktop): full 240-px sidebar, 4-column stats.

### 10. State changes (Zustand store)

**None.** This is a UI-only refresh. `useAppStore` is not opened. If a future change needs UI state for the sidebar (collapsed/expanded), it lives in component state (`useState`) — not in the global store.

## Risks / Trade-offs

- **[Risk]** Adding `Fraunces` increases font payload (~25 KB woff2 subset). → **Mitigation**: load only weight 600 + variable axis we use, with `display: 'swap'`.
- **[Risk]** Glassmorphism on Timer hero performs poorly on low-end browsers. → **Mitigation**: use `@supports (backdrop-filter: blur(20px))` and fall back to a flat translucent layer.
- **[Risk]** Switching to a sidebar is a UX shift; muscle memory for the current top nav breaks. → **Mitigation**: only one user (Delfina), low cost; the change is intentional.
- **[Risk]** Adding `lucide-react` is the only new runtime dep; bundle size grows ~30 KB gz. → **Mitigation**: tree-shake; acceptable cost for visual quality.
- **[Risk]** Project color tints on tiles can clash with the new accent palette. → **Mitigation**: tint stays at 12–14% mix into white, keeping all tiles harmonious regardless of project color.
- **[Trade-off]** No dark mode in this change. Tokens are authored CSS-vars-first so a `[data-theme="dark"]` block can be added later without rewriting components.
- **[Trade-off]** No motion library; we limit ourselves to CSS transitions (hover lifts, focus rings). Keeps the bundle and the perceived complexity low.

## Migration Plan

1. Land tokens in `globals.css` first — no visual change yet because nothing references them.
2. Add the 4 UI primitives — still no visible change.
3. Build the new `Sidebar` and swap `RootLayout` from `Nav` to `Sidebar`. Delete `Nav.tsx`. → First visible change; whole app gains the new shell at once.
4. Restyle dashboard (Timer hero → Stats → SessionList).
5. Restyle project pages (List → Form → Detail → Resources).
6. Manual verification pass in browser (per project convention): resize at the three breakpoints, exercise Timer, create/edit a project, open detail page.
7. Rollback: each step is an isolated git commit; revert in reverse order if needed.

## Open Questions

- Does the sidebar collapse on tablet (icon rail) ship in this change, or defer? **Default**: ship if straightforward, defer if it bloats the change.
- Do we want a tiny "now playing" timer indicator in the sidebar when a session is running? **Default**: defer to a follow-up change.
