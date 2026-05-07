## Exploration: dashboard-refresh

### Current State
El Dashboard actual tiene una estructura lineal (una sola columna) donde la lista de sesiones recientes toma protagonismo al principio y las estadísticas quedan relegadas al final. La Sidebar tiene espacio desperdiciado abajo y las secciones de "Mini Stats" y "Recent Projects" están un poco amontonadas sin una jerarquía visual clara.

### Affected Areas
- `src/app/dashboard/page.tsx` — Cambiar de layout lineal a un grid de 2 columnas (lg:grid-cols-3).
- `src/components/features/dashboard/Stats.tsx` — Refactorizar para separar el `SummaryGrid` (chips) de los reportes detallados (`EarningsOverview` y `ProjectTable`).
- `src/components/ui/Sidebar.tsx` — Agregar `WeeklyGoal` progress y `UserFooter` con `mt-auto`.
- `src/store/useAppStore.ts` — (Opcional) Agregar `weeklyGoal` (default 40h) para que la barra sea dinámica.

### Approaches
1. **Grid Layout con Sidebar Reforzada** — Reubicar los "Summary Chips" al inicio del Dashboard y usar un layout de 2/3 para sesiones y 1/3 para métricas secundarias. En la sidebar, mover acciones globales y el perfil al fondo.
   - Pros: Máximo aprovechamiento del espacio, jerarquía visual clara, look & feel más "SaaS premium".
   - Cons: Requiere un refactor moderado de los componentes de Stats para que sean modulares.
   - Effort: Medium

2. **Reordenamiento Secuencial** — Simplemente mover los Stats arriba de las sesiones y dejar la sidebar como está.
   - Pros: Muy bajo esfuerzo, riesgo nulo.
   - Cons: Sigue sintiéndose como una lista larga en lugar de un tablero de control; desperdicio de espacio lateral en desktop.
   - Effort: Low

### Recommendation
Recomiendo la **Opción 1**. El proyecto ya tiene una base visual muy buena (Playful Redesign) y un layout de grid le va a dar ese salto de calidad que el usuario está buscando ("aprovechar al máximo").

### Risks
- El refactor de `Stats.tsx` debe ser cuidadoso para no romper el cálculo de earnings que ya funciona.
- La sidebar en mobile debe ocultar las secciones nuevas o colapsarlas para no ocupar toda la pantalla.

### Ready for Proposal
Yes. Tenemos claro qué archivos tocar y el impacto visual será inmediato.
