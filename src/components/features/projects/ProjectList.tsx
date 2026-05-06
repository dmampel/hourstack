'use client';

import { useAppStore } from '../../../store/useAppStore';
import { formatCurrency } from '../../../lib/utils';
import { Project } from '../../../types';
import Link from 'next/link';

interface ProjectListProps {
  onEdit: (project: Project) => void;
}

export default function ProjectList({ onEdit }: ProjectListProps) {
  const projects = useAppStore((state) => state.projects);
  const deleteProject = useAppStore((state) => state.deleteProject);

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No projects yet</p>
        <p className="text-sm mt-1">Create your first project to get started.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {projects.map((project) => (
        <li
          key={project.id}
          className="flex items-center justify-between py-4 gap-4"
        >
          <Link 
            href={`/projects/${project.id}`}
            className="min-w-0 flex-1 group"
          >
            <p className="font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{project.name}</p>
            {project.client && (
              <p className="text-sm text-gray-500 truncate">{project.client}</p>
            )}
          </Link>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-medium text-indigo-600 whitespace-nowrap">
              {formatCurrency(project.hourlyRate, project.currency)}/hr
            </span>

            <button
              onClick={() => onEdit(project)}
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
            >
              Edit
            </button>

            <button
              onClick={() => {
                if (
                  confirm(
                    `Delete "${project.name}"? This will also remove all associated sessions.`
                  )
                ) {
                  deleteProject(project.id);
                }
              }}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
