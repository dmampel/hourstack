'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Plus, Trash2, Link as LinkIcon, FileText, Image as ImageIcon, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ProjectResourcesProps {
  projectId: string;
}

export default function ProjectResources({ projectId }: ProjectResourcesProps) {
  const project = useAppStore(useShallow((s) => s.projects.find((p) => p.id === projectId)));
  const addResource = useAppStore((s) => s.addResource);
  const removeResource = useAppStore((s) => s.removeResource);

  const [isAdding, setIsAdding] = useState(false);
  const [addType, setAddType] = useState<'link' | 'file'>('link');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [fileData, setFileData] = useState<string | null>(null);

  if (!project) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for MVP
      alert('File too large for local storage. Please use files under 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData(reader.result as string);
      if (!label) setLabel(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (file.size > 1024 * 1024) {
            alert('Screenshot too large (>1MB).');
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setFileData(reader.result as string);
            setAddType('file');
            if (!label) setLabel(`Screenshot ${new Date().toLocaleTimeString()}`);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (addType === 'link') {
      if (!label || !url) return;
      let validUrl = url;
      if (!url.startsWith('http')) validUrl = `https://${url}`;
      addResource(projectId, { label, url: validUrl, type: 'link' });
    } else {
      if (!label || !fileData) return;
      addResource(projectId, { label, url: '#', type: 'file', data: fileData });
    }

    resetForm();
  };

  const resetForm = () => {
    setLabel('');
    setUrl('');
    setFileData(null);
    setIsAdding(false);
    setAddType('link');
  };

  const openResource = (res: any) => {
    if (res.type === 'link') {
      window.open(res.url, '_blank', 'noopener,noreferrer');
    } else {
      const win = window.open();
      win?.document.write(`<iframe src="${res.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
  };

  const resources = project.resources || [];

  return (
    <Card padding="md">
      <p className='mb-4 text-[var(--text-h2)] text-[var(--color-ink)] font-[family-name:var(--font-fraunces)]'>Resources</p>
      <div className="space-y-4">
        {resources.length === 0 && !isAdding && (
          <p className="text-sm text-[var(--color-ink-soft)] italic">
            No resources added yet.
          </p>
        )}

        <div className="space-y-2">
          {resources.map((res) => (
            <div 
              key={res.id} 
              onClick={() => openResource(res)}
              className="group flex items-center justify-between rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-3 transition-all hover:border-[var(--color-grape)] hover:shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-grape)]">
                  {res.type === 'file' ? (
                    res.data?.startsWith('data:image') ? <ImageIcon size={14} /> : <FileText size={14} />
                  ) : (
                    <LinkIcon size={14} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-ink)]">{res.label}</p>
                  {res.type === 'link' ? (
                    <span className="flex items-center gap-1 truncate text-[10px] text-[var(--color-ink-soft)] hover:text-[var(--color-grape)] transition-colors">
                      {res.url.replace(/^https?:\/\//, '')}
                      <ExternalLink size={10} />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 truncate text-[10px] text-[var(--color-ink-soft)] hover:text-[var(--color-grape)] transition-colors">
                      View File
                      <ExternalLink size={10} />
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeResource(projectId, res.id); }}
                className="rounded-md p-1.5 text-[var(--color-line)] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                title="Remove resource"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {isAdding ? (
          <form 
            onSubmit={handleSubmit} 
            onPaste={handlePaste}
            className="mt-4 space-y-3 rounded-xl border border-[var(--color-grape)] border-dashed p-4 bg-[color-mix(in_srgb,var(--color-grape)_3%,white)]"
          >
            <div className="flex gap-2 p-0.5 rounded-lg bg-[var(--color-surface-muted)]">
              <button
                type="button"
                onClick={() => setAddType('link')}
                className={`flex-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${addType === 'link' ? 'bg-white text-[var(--color-grape)] shadow-sm' : 'text-[var(--color-ink-soft)]'}`}
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => setAddType('file')}
                className={`flex-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${addType === 'file' ? 'bg-white text-[var(--color-grape)] shadow-sm' : 'text-[var(--color-ink-soft)]'}`}
              >
                File
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={addType === 'link' ? "e.g. Figma Design" : "e.g. Screenshot"}
                className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-1.5 text-sm outline-none focus:border-[var(--color-grape)]"
                autoFocus
                required
              />
            </div>

            {addType === 'link' ? (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="figma.com/file/..."
                  className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-1.5 text-sm outline-none focus:border-[var(--color-grape)]"
                  required
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Upload File</label>
                {fileData ? (
                  <div className="flex items-center justify-between rounded-lg border border-[var(--color-line)] bg-white p-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {fileData.startsWith('data:image') ? (
                        <img src={fileData} className="h-8 w-8 rounded object-cover" alt="Preview" />
                      ) : (
                        <FileText size={20} className="text-[var(--color-ink-soft)]" />
                      )}
                      <span className="truncate text-xs text-[var(--color-ink-soft)]">File ready</span>
                    </div>
                    <button type="button" onClick={() => setFileData(null)} className="text-[var(--color-ink-soft)] hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-line)] bg-white py-4 text-[var(--color-ink-soft)] hover:border-[var(--color-grape)]">
                      <Plus size={20} />
                      <span className="text-xs">Choose file (max 1MB)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="secondary" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Add {addType === 'link' ? 'Link' : 'File'}
              </Button>
            </div>
          </form>
        ) : (
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full border-dashed"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={14} />
            Add
          </Button>
        )}
      </div>
    </Card>
  );
}
