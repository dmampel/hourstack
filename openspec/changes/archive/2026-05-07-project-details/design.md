# Design: Project Details Page

## Technical Approach

Implementaremos la página dinámica `app/projects/[id]/page.tsx`. Utilizaremos los hooks `useAppStore` para obtener el proyecto y sus sesiones. 

### UI Structure
1. **Header Section**: Fondo con gradiente sutil basado en el color del proyecto.
2. **Metrics Grid**: 3 columnas (Total Time, Total Earnings, Session count).
3. **Tabs/Sections Layout**:
   - Izquierda: Lista de sesiones (`SessionList` con prop `projectId`).
   - Derecha: `ProjectResources` (CRUD de links) y metadatos adicionales.

## Architecture Decisions

### Decision: Reusing SessionList
**Choice**: Añadir soporte para filtrado por `projectId` al componente `SessionList` existente.
**Rationale**: Mantener la consistencia visual y de lógica de borrado/edición de sesiones sin duplicar código.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/projects/[id]/page.tsx` | Create | Página de detalle. |
| `src/components/features/projects/ProjectResources.tsx` | Create | Gestión de links. |
| `src/components/features/sessions/SessionList.tsx` | Modify | Soporte para `projectId` filter. |
| `src/components/features/projects/ProjectList.tsx` | Modify | Envolver tarjetas en `Link`. |
| `src/components/features/dashboard/SummaryGrid.tsx` | Modify | Envolver avatares del dock en `Link`. |
