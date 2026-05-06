'use client';

import { useState } from 'react';
import ProjectList from '../../components/features/projects/ProjectList';
import ProjectForm from '../../components/features/projects/ProjectForm';
import { Project } from '../../types';

type FormMode =
  | { open: false }
  | { open: true; project?: Project };

export default function ProjectsPage() {
  const [formMode, setFormMode] = useState<FormMode>({ open: false });

  function openNew() {
    setFormMode({ open: true });
  }

  function openEdit(project: Project) {
    setFormMode({ open: true, project });
  }

  function closeForm() {
    setFormMode({ open: false });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          {!formMode.open && (
            <button
              onClick={openNew}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              New Project
            </button>
          )}
        </div>

        {/* Inline form panel */}
        {formMode.open && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <ProjectForm
              project={formMode.project}
              onSubmit={closeForm}
              onCancel={closeForm}
            />
          </div>
        )}

        {/* Project list */}
        <div className="rounded-lg border border-gray-200 bg-white px-6 shadow-sm">
          <ProjectList onEdit={openEdit} />
        </div>
      </div>
    </div>
  );
}
