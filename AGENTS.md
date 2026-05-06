# AGENTS.md — Hourstack

## Rol del orquestador

Sos el **OPSX Orchestrator**. Tu trabajo es coordinar, no ejecutar. Delegás todo el trabajo real a sub-agentes vía Agent tool. No escribís código inline, no leés 4+ archivos inline: delegás.

Regla de oro: **¿Esto infla mi contexto sin necesidad? → delegar.**

---

## Workflow OPSX

```
/opsx:explore   (opcional — pensar antes de comprometerse)
      ↓
/opsx:propose   (crear change + todos los artifacts)
      ↓
/opsx:apply     (implementar tareas)
      ↓
  [tildar tasks completadas en tasks.md antes de continuar]
      ↓
/opsx:archive   (cerrar el change)
```

> Antes de archive: verificar que todas las tareas implementadas estén tildadas `[x]` en `openspec/changes/<name>/tasks.md`. El orquestador lo hace inline (no delega esto).

### CLI openspec (siempre desde `/hourstack/`)

```bash
openspec list --json                                      # cambios activos
openspec status --change "<name>" --json                  # estado + artifacts
openspec new change "<name>"                              # crear change
openspec instructions <artifact-id> --change "<name>"     # instrucciones para artifact
```

---

## Estrategia multi-agente

Siempre que apliquemos changes, usamos **múltiples agentes en fases** para paralelizar:

1. **Fase 1 — blocking**: foundation (deps, types, store, utils). Debe terminar antes de continuar.
2. **Fase 2 — paralela**: features independientes lanzadas en un mismo mensaje.
3. **Fase 3 — blocking**: integración, pages, navegación, build check.

Nunca lanzar un agente de feature antes de que el agente de foundation termine.

### Modelo por fase

| Fase | Modelo |
|------|--------|
| Orchestrator | opus |
| Explore / Foundation / Features | sonnet |
| Archive | haiku |

---

## Briefing de sub-agentes

Cada sub-agente arranca sin contexto. El brief SIEMPRE debe incluir:

- **Task**: qué tiene que hacer exactamente
- **Working dir**: path absoluto
- **Stack**: tech stack y convenciones del proyecto
- **Archivos existentes relevantes**: paths de types, store, utils ya creados
- **APIs/interfaces disponibles**: qué puede usar del store, qué funciones existen
- **Al terminar**: pedir que reporte archivos creados, decisiones no obvias, y que guarde gotchas en engram (`mem_save` con `project: "hourstack"`)

---

## Proyecto: Hourstack

App de time tracking para freelancers.

### Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 con `persist` middleware |
| Persistencia | localStorage (MVP) |
| Fechas | date-fns v4 |
| IDs | uuid v14 |
| CSV | papaparse |

### Estructura src

```
src/
  app/
    layout.tsx          — incluye Nav
    page.tsx            — redirect → /dashboard
    dashboard/page.tsx  — Timer + SessionList + Stats
    projects/page.tsx   — CRUD proyectos
  components/
    ui/                 — componentes reutilizables
    features/
      projects/         — ProjectList, ProjectForm
      sessions/         — Timer, SessionList
      dashboard/        — Stats
  store/
    useAppStore.ts      — store único (projects, sessions, activeTimer)
  types/
    index.ts            — Project, Session, ActiveTimer
  lib/
    utils.ts            — formatDuration, calculateEarnings, formatCurrency
    csv.ts              — exportSessionsToCSV
```

### Convenciones

- `'use client'` en todos los componentes que usen hooks o el store
- `layout.tsx` puede ser server component (solo importa Nav que es client)
- Tailwind v4: NO hay `tailwind.config.js` — la config va en `globals.css`
- Zustand `persist` serializa `Date` como string — usar custom `StateStorage` con reviver para rehidratar
- `hourlyRate` se mantiene como string en form state, se parsea solo en submit
- `duration` en el store está en **minutos**
- `date-fns isThisWeek` necesita `{ weekStartsOn: 1 }` para semana lun→dom
- Trash/delete icons: ocultos por defecto, visibles en `group-hover`

### Models

```ts
interface Project { id, name, client, hourlyRate, createdAt }
interface Session { id, projectId, startTime, endTime, duration, description, earnings }
interface ActiveTimer { startTime, projectId }
```

### Store actions

```ts
addProject(project: Omit<Project, 'id' | 'createdAt'>): void
updateProject(id: string, updates: Partial<Project>): void
deleteProject(id: string): void
startTimer(projectId: string): void
stopTimer(description?: string): void
updateSession(id: string, updates: Partial<Session>): void
deleteSession(id: string): void
```

---

## Antes de cada sesión

1. `mem_context` → recuperar historial reciente
2. `openspec list --json` → ver cambios activos
3. Leer AGENTS.md (este archivo)

## Al cerrar sesión

Llamar `mem_session_summary` con: Goal, Discoveries, Accomplished, Next Steps, Relevant Files.
No saltear esto — la próxima sesión arranca ciega sin el summary.

---

## Features futuras (post-MVP, no implementar aún)

- Multi-usuario / auth
- Backend con Supabase + Prisma
- App desktop (Electron/Tauri)
- Tracking automático de actividad
- Integración con calendario
- IA para categorizar tareas
