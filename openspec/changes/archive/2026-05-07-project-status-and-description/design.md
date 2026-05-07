# Design: Project Status & Description

## Arquitectura de Estado

### Definición de Estados (Config Object)
Para facilitar el mantenimiento y la consistencia visual, utilizaremos un objeto constante que mapee los estados a sus estilos y labels.

```typescript
const STATUS_CONFIG = {
  'just-started': { label: 'Just Started', color: 'slate', icon: Sparkles },
  'in-progress': { label: 'In Progress', color: 'blue', icon: Zap },
  'mvp': { label: 'MVP Phase', color: 'emerald', icon: Box },
  'polishing': { label: 'Polishing', color: 'amber', icon: Paintbrush },
  'almost-done': { label: 'Almost Done', color: 'indigo', icon: CheckCircle },
  'completed': { label: 'Completed', color: 'green', icon: Flag },
};
```

### Persistencia en Zustand
- Se actualizará el middleware de persistencia para manejar la migración de datos (hydration).
- La acción `addProject` ahora incluirá `status: 'just-started'` por defecto.

## Componentes UI

### 1. StatusBadge (Nuevo)
Componente atómico para mostrar el estado.
- **Props**: `status: ProjectStatus`.
- **Estilo**: Fondo translúcido del color del estado (`bg-color/10`), borde fino (`border-color/20`) y texto con contraste.
- **Ubicación**: 
    - `ProjectList`: Arriba a la derecha del nombre.
    - `ProjectDetailPage`: Al lado del H1.

### 2. Formulario de Proyecto (Actualización)
- **Select de Estado**: Reutilizar el estilo de los inputs de Hourstack con un ChevronDown personalizado.
- **Textarea de Descripción**: Un campo con `rows={3}` para la descripción.
- **Validación**: La descripción es opcional.

### 3. Página de Detalle (`app/projects/[id]/page.tsx`)
- **Layout**: La descripción se insertará debajo de los metadatos del header (Client/Rate).
- **Tipografía**: Usaremos un color `ink-soft` y un tamaño de fuente `sm` o `base` dependiendo de la longitud.

## Consideraciones de Diseño
- **Accesibilidad**: Asegurar que los colores de los badges tengan suficiente contraste sobre el fondo del header dinámico.
- **Empty States**: Si un proyecto no tiene descripción, simplemente no renderizamos el bloque para no romper el ritmo visual.
