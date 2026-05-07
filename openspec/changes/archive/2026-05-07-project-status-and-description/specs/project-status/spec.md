# Spec: Project Status & Description

## Contexto
El usuario necesita categorizar sus proyectos por su estado de avance y tener un lugar donde guardar notas generales o descripciones del proyecto que no interfieran con la vista limpia del dashboard.

## Escenarios de Usuario

### 1. Definición de Estado en Creación/Edición
- Al crear un proyecto nuevo, el estado por defecto debe ser `Just Started`.
- El usuario puede cambiar el estado en cualquier momento desde el modal de edición.
- El selector de estado debe mostrar los nombres amigables (ej: "En Proceso" en vez de `in-progress`).

### 2. Visualización en la Lista de Proyectos
- Cada tarjeta de proyecto debe mostrar un badge pequeño con el estado actual.
- El badge debe tener colores que sigan la paleta del sistema (Zustand/Tailwind).

### 3. Visualización en la Página de Detalle
- El estado debe aparecer destacado en el Header, preferentemente al lado del título.
- La descripción del proyecto debe aparecer debajo de los metadatos del header (Cliente, Tarifa, etc.).
- Si no hay descripción, el espacio no debe verse vacío de forma extraña.

## Requerimientos Técnicos

### Estados Definidos
| Key | Label | Color (Base) | Icon (Lucide) |
|-----|-------|--------------|---------------|
| `just-started` | Just Started | Gray | `Sparkles` |
| `in-progress` | In Progress | Blue | `Zap` |
| `mvp` | MVP Phase | Lime | `Box` |
| `polishing` | Polishing | Tangerine | `Paintbrush` |
| `almost-done` | Almost Done | Indigo | `CheckCircle` |
| `completed` | Completed | Mint | `Flag` |

### Persistencia
- Los nuevos campos deben ser serializables en el store de Zustand y persistirse en `localStorage`.
- Los proyectos antiguos que no tengan estos campos deben rehidratarse con `status: 'just-started'` y `description: ''`.

## Diseño de UI (Referencia)
- **Badge**: `px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider`.
- **Descripción**: Fuente `Inter`, color `ink-soft`, con soporte para saltos de línea básicos.
