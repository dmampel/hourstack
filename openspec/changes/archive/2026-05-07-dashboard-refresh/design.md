# Design: Dashboard & Sidebar Refresh

## Technical Approach

La estrategia consiste en modularizar el componente monolítico `Stats.tsx` en piezas independientes para permitir una distribución flexible en el Dashboard. Utilizaremos CSS Grid de Tailwind para el nuevo layout del Dashboard y `flex-col` con `mt-auto` para la Sidebar. El cálculo del progreso semanal se integrará en el store central.

## Architecture Decisions

### Decision: Component Modularization
**Choice**: Dividir `Stats.tsx` en `SummaryGrid`, `EarningsOverview` y `ProjectTable`.
**Alternatives considered**: Pasar props condicionales a `Stats.tsx` para ocultar partes según el contexto.
**Rationale**: Modularizar permite reutilizar piezas (ej: los chips) en otros lugares y hace que `Dashboard/page.tsx` sea el orquestador del layout, no el componente de stats.

### Decision: Weekly Goal in Store
**Choice**: Agregar `weeklyGoal` (number, default 40) al `useAppStore`.
**Alternatives considered**: Hardcodear el valor en el componente.
**Rationale**: Mantenerlo en el store permite persistencia vía localStorage y futura edición por parte del usuario.

## Data Flow

```
Store (sessions, projects, weeklyGoal, activeTimer)
   │
   ├──→ Sidebar (Sticky 0, h-screen)
   │     ├──→ Nav (Scrollable)
   │     ├──→ WeeklyProgress (calcula % basado en sesiones de la semana)
   │     ├──→ MiniStats (Today focus)
   │     └──→ UserFooter (Fixed bottom)
   │
   ├──→ Dashboard/SummaryGrid (4 columns: Highlights lg:col-span-3 + MiniChips)
   │     ├──→ Project Dock (macOS Style)
   │     └──→ Partitioned Metrics (Top Project, Avg Session)
   │
   └──→ Dashboard/MainContent (ProjectTable & SessionList)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/dashboard/page.tsx` | Modify | Layout de grid complejo (lg:grid-cols-4). |
| `src/app/sessions/page.tsx` | Create | Nueva página con el listado completo de sesiones. |
| `src/components/features/dashboard/SummaryGrid.tsx` | Create | Dashboard Header con Project Dock y métricas particionadas. |
| `src/components/features/dashboard/EarningsOverview.tsx` | Create | Balances por moneda (USD/ARS). |
| `src/components/features/dashboard/ProjectTable.tsx` | Create | Tabla con scroll horizontal para legibilidad. |
| `src/components/features/sessions/Timer.tsx` | Modify | Rediseño: Display en card + Controles externos + `resetTimer`. |
| `src/components/features/sidebar/WeeklyProgress.tsx` | Create | Barra de progreso con meta semanal persistente. |
| `src/components/features/sidebar/UserFooter.tsx` | Create | Footer fijo al fondo de la sidebar. |
| `src/components/ui/Sidebar.tsx` | Modify | Sidebar sticky/scrollable con navegación y widgets integrados. |
| `src/store/useAppStore.ts` | Modify | Storage v5: `weeklyGoal` y `resetTimer`. |

## Interfaces / Contracts

```typescript
// src/types/index.ts (Update)
interface AppState {
  // ...
  weeklyGoal: number; // default 40
  setWeeklyGoal: (goal: number) => void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Cálculo de % del Weekly Goal | Manual (mockeando sesiones de la semana). |
| Integration | Responsividad del Dashboard Grid | Visual en browser (mobile/desktop). |

## Migration / Rollout

No se requiere migración. El campo `weeklyGoal` se inicializará en 40 automáticamente al rehidratar el store si no existe.

## Open Questions

- [ ] ¿El avatar del UserFooter debe ser dinámico o un placeholder fijo por ahora? (Usaremos un placeholder premium de Lucide).
