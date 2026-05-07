# Proposal: Dashboard & Sidebar Refresh

## Intent

Optimizar el Dashboard para una mejor jerarquía de información (stats arriba, sesiones abajo) y aprovechar el espacio desperdiciado en la sidebar para dar más valor al usuario con indicadores de progreso y accesos rápidos.

## Scope

### In Scope
- Refactor modular de `Stats.tsx` para separar componentes (Summary, Earnings, Table).
- Implementación de Grid Layout complejo (lg:grid-cols-4) en `Dashboard/page.tsx`.
- Adición de componente `WeeklyGoal` y área scrolleable en la Sidebar.
- Adición de `UserFooter` (perfil/settings) fixed al final de la Sidebar.
- Rediseño del `Timer` con display premium y controles externos.
- Nueva página de `/sessions` para el listado histórico completo.
- Actualización del store para soportar `weeklyGoal` y `resetTimer` (v5 storage).

### Out of Scope
- Backend real para Auth (se mantiene mock/local).
- Edición avanzada de perfil de usuario.
- Gráficos complejos de tendencia (se mantienen los chips actuales).

## Capabilities

### New Capabilities
- `weekly-goal-tracking`: Lógica de cálculo y visualización del progreso semanal frente a un objetivo de horas.

### Modified Capabilities
- `dashboard`: Cambio en la disposición de elementos y jerarquía visual.

## Approach

Separar el componente `Stats.tsx` en piezas independientes (`SummaryGrid`, `EarningsOverview`, `ProjectTable`). Esto permitirá que en `Dashboard/page.tsx` podamos ubicar el `SummaryGrid` al principio y el resto en una columna lateral. En la `Sidebar.tsx`, usaremos `flex flex-col` y `mt-auto` para empujar la sección de perfil al fondo, llenando el espacio vacío actual.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/dashboard/page.tsx` | Modified | Nuevo layout de grid (lg:grid-cols-4). |
| `src/app/sessions/page.tsx` | Created | Nueva página de histórico de sesiones. |
| `src/components/ui/Sidebar.tsx` | Modified | Sidebar scrolleable con `WeeklyGoal` y `UserFooter`. |
| `src/components/features/sessions/Timer.tsx` | Modified | Rediseño completo y botón reset. |
| `src/store/useAppStore.ts` | Modified | Nuevo estado para `weeklyGoal` y `resetTimer`. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Inconsistencia en mobile | Med | Asegurar que el grid colapse correctamente a una sola columna. |
| Desbordamiento en sidebar | Low | Mantener los componentes de la sidebar compactos. |

## Rollback Plan

Revertir los cambios en los archivos afectados vía Git. La estructura de datos no se altera de forma destructiva (solo se agrega un campo opcional al store).

## Dependencies

- `date-fns`: Ya instalado para cálculos de semana.
- `lucide-react`: Ya instalado para iconos.

## Success Criteria

- [x] Las estadísticas de resumen (SummaryGrid) aparecen al principio del Dashboard con Project Dock.
- [x] El Dashboard utiliza un layout de 4 columnas en desktop (3 para highlights, 1 para mini-chips).
- [x] La sidebar es scrolleable, incluye barra de progreso semanal y un footer de usuario fijo.
- [x] El Timer tiene un diseño premium separado de los controles y funcionalidad de reset.
- [x] Existe una página funcional en `/sessions` con el listado completo.
