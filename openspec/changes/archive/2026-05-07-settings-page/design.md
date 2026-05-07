# Design: Settings Page

## Technical Approach

Implementaremos una nueva página `app/settings/page.tsx` que consuma el store. Utilizaremos el patrón de formulario controlado para los campos de perfil. Para la exportación de datos, usaremos un `Blob` de JS con el contenido del store serializado.

## Architecture Decisions

### Decision: Settings Object in Store
**Choice**: Agrupar las configuraciones en un objeto `settings` dentro del store.
**Rationale**: Facilita la expansión futura de preferencias (temas, notificaciones) sin ensuciar la raíz del store.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modify | Agregar `UserSettings`. |
| `src/store/useAppStore.ts` | Modify | Agregar objeto `settings`, acción `updateSettings` y lógica de `resetStore`. |
| `src/app/settings/page.tsx` | Create | Interfaz de configuración. |
| `src/app/dashboard/page.tsx` | Modify | Consumir `settings.name` para el saludo. |

## Data Structure

```typescript
interface UserSettings {
  name: string;
  weeklyGoal: number;
  defaultCurrency: 'USD' | 'ARS';
}
```
