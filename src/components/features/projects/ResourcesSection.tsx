'use client';

import { useState } from 'react';
import { Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Resource } from '@/types';
import Card from '@/components/ui/Card';
import IconButton from '@/components/ui/IconButton';
import Button from '@/components/ui/Button';

interface ResourcesSectionProps {
  projectId: string;
  resources: Resource[];
}

export function ResourcesSection({ projectId, resources }: ResourcesSectionProps) {
  const addResource = useAppStore((state) => state.addResource);
  const removeResource = useAppStore((state) => state.removeResource);

  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !url) return;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    addResource(projectId, { label, url: fullUrl });
    setLabel('');
    setUrl('');
    setIsAdding(false);
  };

  const inputClass =
    'mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none transition-all focus:border-[var(--color-grape)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-grape)_15%,transparent)]';

  return (
    <Card padding="md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Resources</h3>
        {!isAdding && (
          <IconButton aria-label="Add resource" size="sm" onClick={() => setIsAdding(true)}>
            <Plus size={16} />
          </IconButton>
        )}
      </div>

      <div className="space-y-2">
        {resources.length === 0 && !isAdding && (
          <p className="py-4 text-center text-xs italic text-[var(--color-ink-soft)]">
            No resources added yet.
          </p>
        )}

        {/* Resource chips */}
        <div className="flex flex-wrap gap-2">
          {resources.map((resource) => (
            <div key={resource.id} className="group flex items-center gap-1.5">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-surface-muted)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-all hover:border-[var(--color-grape)] hover:bg-[color-mix(in_srgb,var(--color-grape)_8%,var(--color-surface))] hover:text-[var(--color-grape)]"
              >
                <LinkIcon size={12} className="flex-shrink-0" />
                <span className="truncate max-w-[140px]">{resource.label}</span>
              </a>
              <button
                onClick={() => removeResource(projectId, resource.id)}
                aria-label={`Remove resource ${resource.label}`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-line)] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>

        {/* Add form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-[var(--color-line)] pt-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. GitHub Repo"
                autoFocus
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="github.com/..."
                className={inputClass}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" variant="primary" size="sm" className="flex-1">
                Save
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
