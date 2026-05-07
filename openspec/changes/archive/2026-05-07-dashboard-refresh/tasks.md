# Tasks: Dashboard & Sidebar Refresh

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 250-300 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Medium

## Phase 1: Foundation (Store & Types)

- [x] 1.1 Actualizar `src/types/index.ts` para incluir `weeklyGoal: number` y `setWeeklyGoal`.
- [x] 1.2 Actualizar `src/store/useAppStore.ts` con el estado inicial, la acción de set y `resetTimer`.

## Phase 2: Modularize Stats Components

- [x] 2.1 Crear `src/components/features/dashboard/SummaryGrid.tsx` (extraído de `Stats.tsx`).
- [x] 2.2 Crear `src/components/features/dashboard/EarningsOverview.tsx` (extraído de `Stats.tsx`).
- [x] 2.3 Crear `src/components/features/dashboard/ProjectTable.tsx` (extraído de `Stats.tsx`).
- [x] 2.4 Limpiar `src/components/features/dashboard/Stats.tsx` para que solo exporte/orqueste estas piezas.

## Phase 3: Sidebar Enhancements

- [x] 3.1 Crear `src/components/features/sidebar/WeeklyProgress.tsx` con la lógica de barra de progreso.
- [x] 3.2 Crear `src/components/features/sidebar/UserFooter.tsx` (perfil/settings).
- [x] 3.3 Modificar `src/components/ui/Sidebar.tsx` para integrar los nuevos componentes, área scrolleable y `UserFooter` fijo.

## Phase 4: Dashboard Page Layout

- [x] 4.1 Actualizar `src/app/dashboard/page.tsx` para implementar el layout de grid (lg:grid-cols-4) y reubicar componentes.

## Phase 5: Verification

- [x] 5.1 Verificar que el SummaryGrid aparezca al inicio en el Dashboard.
- [x] 5.2 Verificar que el layout de 2 columnas se active en desktop y se mantenga en 1 en mobile.
- [x] 5.3 Verificar que la barra de progreso de la Sidebar calcule correctamente el % de la semana.

## Phase 6: Polish & Refinement (Feedback Iteration)

- [x] 6.1 **Timer**: Agregar acción `resetTimer` al store y botón de reinicio en el componente `Timer.tsx`. Rediseño visual (separar controles de display).
- [x] 6.2 **Sidebar**:
    - [x] Quitar "Pending payment" de `MiniStats` (dejar solo info del día).
    - [x] Agregar "Sessions" a `navItems`.
- [x] **Dashboard**:
    - [x] **SummaryGrid**: Métricas de "Top Project", "Average Session", "This Week" y "This Month" (con desglose por moneda).
    - [x] **SessionList**: Limitar a 5 items + link "View all sessions" a `/sessions`.
    - [x] **ProjectTable**: Re-ubicar/expandir con scroll horizontal.
    - [x] **EarningsOverview**: Simplificar diseño con desglose ARS/USD.
- [x] 6.3 **New Page**: Crear `src/app/sessions/page.tsx` para el listado completo de sesiones.
