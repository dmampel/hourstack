'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { Project } from '../../../types';

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

  // Keep fields in sync if the project prop changes (e.g. switching edit targets)
  useEffect(() => {
    setName(project?.name ?? '');
    setClient(project?.client ?? '');
    setHourlyRate(project?.hourlyRate !== undefined ? String(project.hourlyRate) : '');
    setCurrency(project?.currency ?? 'ARS');
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
      });
    } else {
      addProject({
        name: name.trim(),
        client: client.trim(),
        hourlyRate: parsedRate,
        currency,
      });
    }

    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditing ? 'Edit Project' : 'New Project'}
      </h2>

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="client" className="block text-sm font-medium text-gray-700">
          Client
        </label>
        <input
          id="client"
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Client name (optional)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'ARS' | 'USD')}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ARS">ARS (Pesos)</option>
            <option value="USD">USD (Dólares)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
