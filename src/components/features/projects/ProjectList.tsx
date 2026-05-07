'use client';

import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency } from '@/lib/utils';
import { Project } from '@/types';
import Badge, { currencyTone } from '@/components/ui/Badge';

interface ProjectListProps {
  onEdit: (project: Project) => void;
}

export default function ProjectList({ onEdit }: ProjectListProps) {
  const projects = useAppStore((state) => state.projects);
  const deleteProject = useAppStore((state) => state.deleteProject);

  if (projects.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[var(--color-ink)]">
          No projects yet
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Create your first project to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const projectColor = project.color || '#7C5CFF';

        return (
          <div
            key={project.id}
            className="group relative rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-soft)] transition-all duration-200 hover:shadow-[var(--shadow-pop)] hover:-translate-y-0.5"
            style={{ background: `color-mix(in srgb, ${projectColor} 14%, var(--color-surface))` }}
          >
            <Link href={`/projects/${project.id}`} className="absolute inset-0 rounded-[var(--radius-lg)]" aria-label={project.name} />

            <div className="mb-3 h-3 w-3 rounded-full" style={{ backgroundColor: projectColor }} aria-hidden="true" />

            <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-grape)] truncate">
              {project.name}
            </h3>
            {project.client && (
              <p className="mt-0.5 text-sm text-[var(--color-ink-soft)] truncate">{project.client}</p>
            )}

            <div className="mt-4 flex items-center justify-between gap-2">
              <Badge tone={currencyTone(project.currency)}>
                {formatCurrency(project.hourlyRate, project.currency)}/hr
              </Badge>

              <div className="relative z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => { e.preventDefault(); onEdit(project); }}
                  className="rounded-[var(--radius-sm)] px-2 py-1 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-white/60 hover:text-[var(--color-ink)]"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm(`Delete "${project.name}"? This will also remove all associated sessions.`)) {
                      deleteProject(project.id);
                    }
                  }}
                  className="rounded-[var(--radius-sm)] px-2 py-1 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-red-100 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
