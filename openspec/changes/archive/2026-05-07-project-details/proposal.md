# Proposal: Project Details Page

## Intent

Proporcionar una vista profunda de cada proyecto, permitiendo al usuario analizar el historial de trabajo, ganancias específicas y gestionar recursos externos asociados al cliente.

## Scope

### In Scope
- Nueva ruta dinámica `/projects/[id]`.
- **Project Header**: Nombre, Cliente, Tarifa horaria y color del proyecto.
- **Project Stats**: Resumen de horas totales, ganancias totales y conteo de sesiones.
- **Session History**: Lista filtrada de sesiones pertenecientes al proyecto.
- **Resource Management**: Sección para añadir/eliminar links útiles (Figma, GitHub, etc.).
- **Navegación**: Linkear las tarjetas de proyecto y el "Project Dock" del dashboard a sus respectivas páginas de detalle.

### Out of Scope
- Edición del proyecto desde esta página (se mantiene en `/projects` por ahora para mantener la simplicidad del CRUD).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/projects/[id]/page.tsx` | Created | La página principal de detalle. |
| `src/components/features/projects/ProjectList.tsx` | Modified | Hacer que los ítems sean linkeables. |
| `src/components/features/dashboard/SummaryGrid.tsx` | Modified | Hacer que los avatares del Dock sean linkeables. |
| `src/components/features/projects/ProjectResources.tsx` | Created | Componente para gestionar los links externos. |

## Success Criteria

- [ ] Al hacer click en un proyecto desde el dashboard o la lista, se abre su página de detalle.
- [ ] La página muestra métricas precisas filtradas por ese proyecto.
- [ ] Se pueden agregar y eliminar recursos externos (links) que persistan en el store.
- [ ] La interfaz mantiene la estética "premium" (vidrio, gradientes, tipografía Fraunces).
