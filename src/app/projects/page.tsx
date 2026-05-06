'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import ProjectList from '@/components/features/projects/ProjectList';
import ProjectForm from '@/components/features/projects/ProjectForm';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Project } from '@/types';

type FormMode = { open: false } | { open: true; project?: Project };

export default function ProjectsPage() {
  const [formMode, setFormMode] = useState<FormMode>({ open: false });

  function openNew() { setFormMode({ open: true }); }
  function openEdit(project: Project) { setFormMode({ open: true, project }); }
  function closeForm() { setFormMode({ open: false }); }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-fraunces)] text-[var(--text-h1)] font-semibold text-[var(--color-ink)]">
          Projects
        </h1>
        {!formMode.open && (
          <Button variant="primary" size="md" onClick={openNew}>
            <Plus size={16} />
            New Project
          </Button>
        )}
      </div>

      {/* Inline form */}
      {formMode.open && (
        <Card padding="md">
          <ProjectForm
            project={formMode.open ? formMode.project : undefined}
            onSubmit={closeForm}
            onCancel={closeForm}
          />
        </Card>
      )}

      {/* Project grid */}
      <ProjectList onEdit={openEdit} />
    </div>
  );
}
