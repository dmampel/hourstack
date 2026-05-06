'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Project } from '@/types';
import Button from '@/components/ui/Button';

const COLOR_SWATCHES = [
  '#7C5CFF', // grape
  '#FF8A4C', // tangerine
  '#B8E986', // lime
  '#FF7AB6', // blush
  '#4CC9F0', // sky
  '#F72585', // hot pink
  '#4361EE', // royal blue
  '#3ABEF9', // cyan
  '#06D6A0', // mint
  '#FFD166', // amber
  '#EF476F', // red
  '#118AB2', // teal
];

interface ProjectFormProps {
  project?: Project;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const addProject = useAppStore((state) => state.addProject);
  const updateProject = useAppStore((state) => state.updateProject);

  const isEditing = Boolean(project);

  const [name, setName] = useState(project?.name ?? '');
  const [client, setClient] = useState(project?.client ?? '');
  const [hourlyRate, setHourlyRate] = useState(
    project?.hourlyRate !== undefined ? String(project.hourlyRate) : ''
  );
  const [currency, setCurrency] = useState<'ARS' | 'USD'>(project?.currency ?? 'ARS');
  const [color, setColor] = useState(project?.color ?? '#7C5CFF');

  useEffect(() => {
    setName(project?.name ?? '');
    setClient(project?.client ?? '');
    setHourlyRate(project?.hourlyRate !== undefined ? String(project.hourlyRate) : '');
    setCurrency(project?.currency ?? 'ARS');
    setColor(project?.color ?? '#7C5CFF');
  }, [project]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedRate = parseFloat(hourlyRate);
    if (!name.trim() || isNaN(parsedRate) || parsedRate < 0) return;

    if (isEditing && project) {
      updateProject(project.id, {
        name: name.trim(),
        client: client.trim(),
        hourlyRate: parsedRate,
        currency,
        color,
      });
    } else {
      addProject({
        name: name.trim(),
        client: client.trim(),
        hourlyRate: parsedRate,
        currency,
        color,
      });
    }
    onSubmit();
  }

  const inputClass =
    'w-full rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-soft)] outline-none transition-all focus:border-[var(--color-grape)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-grape)_15%,transparent)]';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-[var(--color-ink)]">
        {isEditing ? 'Edit Project' : 'New Project'}
      </h2>

      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-[var(--color-ink)]">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="client" className="block text-sm font-medium text-[var(--color-ink)]">
          Client
        </label>
        <input
          id="client"
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Client name (optional)"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-[var(--color-ink)]">
            Hourly Rate <span className="text-red-500">*</span>
          </label>
          <input
            id="hourlyRate"
            type="number"
            required
            min={0}
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="currency" className="block text-sm font-medium text-[var(--color-ink)]">
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'ARS' | 'USD')}
            className={inputClass}
          >
            <option value="ARS">ARS (Pesos)</option>
            <option value="USD">USD (Dólares)</option>
          </select>
        </div>
      </div>

      {/* Color picker — 40px circles */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => setColor(swatch)}
              title={swatch}
              aria-label={`Select color ${swatch}`}
              className="relative flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: swatch,
                boxShadow:
                  color === swatch
                    ? `0 0 0 3px var(--color-surface), 0 0 0 5px ${swatch}`
                    : 'none',
              }}
            />
          ))}
        </div>
        {/* Preview strip */}
        <div
          className="mt-2 h-2 w-full rounded-full"
          style={{ background: `color-mix(in srgb, ${color} 30%, var(--color-surface))` }}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md">
          {isEditing ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
