# Tasks: Project Details Page

## Phase 1: Components & Logic

- [ ] 1.1 Actualizar `SessionList.tsx` para aceptar `projectId` como prop de filtrado.
- [ ] 1.2 Crear `src/components/features/projects/ProjectResources.tsx` para gestionar links externos.
- [ ] 1.3 Asegurar que las acciones `addResource` y `removeResource` en el store funcionen correctamente (ya existen pero hay que verificarlas).

## Phase 2: Page Implementation

- [ ] 2.1 Crear `src/app/projects/[id]/page.tsx` con el layout premium (Header + Stats + SessionList + Resources).
- [ ] 2.2 Implementar cálculos de métricas específicos del proyecto.

## Phase 3: Navigation Integration

- [ ] 3.1 Actualizar `ProjectList.tsx` para linkear cada tarjeta al detalle.
- [ ] 3.2 Actualizar el Project Dock en `SummaryGrid.tsx` para linkear los avatares al detalle.

## Phase 4: Verification

- [ ] 4.1 Verificar que los cálculos de ganancias coincidan con los del dashboard global (pero filtrados).
- [ ] 4.2 Probar el CRUD de recursos externos.
- [ ] 4.3 Validar la responsividad en mobile.
