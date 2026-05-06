# Skill Registry — Hourstack

## Compact Rules

### Project Standards
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (config in globals.css)
- **State**: Zustand 5 with persist (custom StateStorage for Date)
- **Logic**: Use date-fns v4 for date handling
- **Architecture**: Features-based structure in `src/components/features`
- **Naming**: Use descriptive names, follow existing patterns
- **Timer**: `duration` in store is in **minutes**
- **Persistence**: localStorage via Zustand persist

### SDD / OPSX
- Use `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:archive`
- Delegar tasks complejos a sub-agentes
- Update `tasks.md` before proceeding
- ARCHIVE only when all tasks are `[x]`

## User Skills
| Skill | Trigger |
|-------|---------|
| sdd-apply | When implementing tasks from a change |
| sdd-verify | When validating implementation |
| comment-writer | When drafting PR/Issue comments |
| branch-pr | When creating a pull request |
