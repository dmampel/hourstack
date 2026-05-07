# Tasks: Project Status & Description Implementation

## Phase 1: Data & Store
- [ ] 1.1 Confirmar tipos en `src/types/index.ts` (ProjectStatus y campos en Project).
- [ ] 1.2 Actualizar `src/store/useAppStore.ts` para incluir valores por defecto (`just-started`, description vacía) en `addProject`.

## Phase 2: UI Components
- [ ] 2.1 Crear `src/components/ui/StatusBadge.tsx` con el objeto de configuración de estados (colores, iconos, labels).
- [ ] 2.2 Actualizar `src/components/features/projects/ProjectForm.tsx` para incluir el selector de estado y el textarea de descripción.

## Phase 3: Integration
- [ ] 3.1 Integrar `StatusBadge` en `src/components/features/projects/ProjectList.tsx` (vista general).
- [ ] 3.2 Actualizar `src/app/projects/[id]/page.tsx` para mostrar el badge en el header y la descripción en el cuerpo del header.

## Phase 4: Verification
- [ ] 4.1 Verificar que al crear un proyecto se asigne el estado por defecto.
- [ ] 4.2 Validar que la edición de descripción persista correctamente.
- [ ] 4.3 Comprobar la responsividad de los nuevos elementos en la página de detalle.
