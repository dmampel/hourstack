'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Resource } from '@/types';

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

    // Ensure URL has protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    addResource(projectId, { label, url: fullUrl });
    setLabel('');
    setUrl('');
    setIsAdding(false);
  };

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Resources</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            Add Link
          </button>
        )}
      </div>

      <div className="space-y-3">
        {resources.length === 0 && !isAdding && (
          <p className="text-xs text-zinc-400 py-4 text-center italic">No resources added yet.</p>
        )}

        {resources.map((resource) => (
          <div key={resource.id} className="group flex items-center justify-between rounded-lg border border-zinc-50 bg-zinc-50/50 p-3 transition-all hover:border-zinc-200 hover:bg-zinc-50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-zinc-700">{resource.label}</p>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="truncate text-[10px] text-zinc-400 hover:text-indigo-500 hover:underline block"
                >
                  {resource.url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
            <button 
              onClick={() => removeResource(projectId, resource.id)}
              className="ml-2 h-6 w-6 items-center justify-center rounded-full text-zinc-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          </div>
        ))}

        {isAdding && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Label</label>
              <input 
                type="text" 
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. GitHub Repo"
                autoFocus
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">URL</label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="github.com/..."
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button 
                type="submit"
                className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
              >
                Save Resource
              </button>
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-lg bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
