# Proposal: Project Status and Description

## Intent

Enriquecer la gestión de proyectos permitiendo rastrear el estado actual del ciclo de vida (desde "Just Started" hasta "Completed") y proporcionar un espacio para descripciones detalladas que den contexto al trabajo realizado.

## Scope

### In Scope
- **Modelo de Datos**: Añadir `status` (ProjectStatus enum) y `description` (string) a la interfaz `Project`.
- **Project Form**: Actualizar el modal de creación/edición para incluir un selector de estado y un campo de texto para la descripción.
- **Visualización de Estado**: Mostrar un badge con el estado actual en la lista de proyectos y en la página de detalle.
- **Descripción Exclusiva**: Mostrar la descripción del proyecto únicamente en la página de detalle (`/projects/[id]`), manteniendo limpia la vista general.
- **Manejo de Estados**: Definir una paleta de colores/iconos para cada estado (Just Started, In Progress, MVP, Polishing, Almost Done, Completed).

### Out of Scope
- Edición rápida del estado desde el Dashboard (se hará a través del modal de edición estándar por ahora).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modified | Nuevos campos en el modelo de Proyecto. |
| `src/store/useAppStore.ts` | Modified | Actualizar acciones de creación con valores por defecto. |
| `src/components/features/projects/ProjectForm.tsx` | Modified | Campos adicionales en el formulario. |
| `src/components/features/projects/ProjectList.tsx` | Modified | Visualización del badge de estado. |
| `src/app/projects/[id]/page.tsx` | Modified | Visualización de descripción y badge de estado en el header. |

## Success Criteria

- [ ] Los proyectos existentes mantienen su integridad (migración segura o valores por defecto).
- [ ] El usuario puede cambiar el estado de un proyecto y este persiste.
- [ ] La descripción se muestra correctamente en el detalle y no en la lista general.
- [ ] La UI de los badges de estado sigue la estética premium del sistema.
