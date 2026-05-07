# Tasks: Settings Page

## Phase 1: Foundation (Types & Store)

- [x] 1.1 Actualizar `src/types/index.ts` con `UserSettings`.
- [x] 1.2 Actualizar `src/store/useAppStore.ts` para incluir `settings` iniciales y las acciones `updateSettings` y `resetStore`.

## Phase 2: Page Implementation

- [x] 2.1 Crear `src/app/settings/page.tsx` con las secciones de Perfil y Gestión de Datos.
- [x] 2.2 Implementar lógica de Exportación JSON.
- [x] 2.3 Implementar lógica de Reset con confirmación nativa (`window.confirm`).

## Phase 3: Integration

- [x] 3.1 Actualizar `src/app/dashboard/page.tsx` para usar `settings.name`.
- [x] 3.2 Actualizar `src/components/features/sidebar/UserFooter.tsx` para vincular el botón de settings.

## Phase 4: Verification

- [ ] 4.1 Probar que el cambio de nombre se refleje en el dashboard.
- [ ] 4.2 Probar que la meta semanal afecte la barra de progreso.
- [ ] 4.3 Probar la exportación y el reset.
