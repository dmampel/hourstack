# Proposal: Settings Page

## Intent

Permitir que el usuario personalice su experiencia (nombre, metas, moneda) y gestione sus datos (backup/reset), eliminando valores hardcodeados en el Dashboard.

## Scope

### In Scope
- Nueva página `/settings` con formulario de perfil.
- Campos: Nombre del usuario, Meta semanal (horas), Moneda por defecto.
- Gestión de datos: Botón para exportar JSON (backup) y botón para borrar todo (Danger Zone).
- Integración: Usar el nombre del store en el saludo del Dashboard.
- Navegación: Vincular el icono de settings del `UserFooter` a `/settings`.

### Out of Scope
- Subida de foto de perfil (se mantiene avatar con iniciales).
- Preferencias de notificaciones o integraciones externas.

## Capabilities

### New Capabilities
- `user-preferences`: Gestión de datos persistentes del perfil de usuario.
- `data-portability`: Funcionalidad básica de backup local.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modified | Definición de `UserSettings`. |
| `src/store/useAppStore.ts` | Modified | Estado de `settings` y acciones de actualización. |
| `src/app/dashboard/page.tsx` | Modified | Saludo dinámico con el nombre del store. |
| `src/components/features/sidebar/UserFooter.tsx` | Modified | Link activo a `/settings`. |
| `src/app/settings/page.tsx` | Created | Interfaz de configuración. |

## Success Criteria

- [ ] Se puede cambiar el nombre del usuario y verlo reflejado en el Dashboard.
- [ ] La meta semanal es configurable y actualiza la barra de progreso de la sidebar.
- [ ] Existe un botón funcional para exportar todos los datos en formato JSON.
- [ ] El botón de "Reset" funciona (con confirmación) y limpia el localStorage.
