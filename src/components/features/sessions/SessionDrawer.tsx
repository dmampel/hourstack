'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import IconButton from '@/components/ui/IconButton';

interface SessionDrawerProps {
  sessionId: string | null;
  onClose: () => void;
}

export function SessionDrawer({ sessionId, onClose }: SessionDrawerProps) {
  const sessions = useAppStore((state) => state.sessions);
  const projects = useAppStore((state) => state.projects);
  const updateSession = useAppStore((state) => state.updateSession);
  const addAttachment = useAppStore((state) => state.addAttachment);
  const removeAttachment = useAppStore((state) => state.removeAttachment);

  const session = sessions.find((s) => s.id === sessionId) || null;
  const project = projects.find((p) => p.id === session?.projectId) || null;

  const [notes, setNotes] = useState(session?.notes || '');
  const [isClosing, setIsClosing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session) setNotes(session.notes || '');
  }, [session?.id]);

  const handleNotesBlur = () => {
    if (session && notes !== session.notes) updateSession(session.id, { notes });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    if (file.size > 1024 * 1024) {
      alert('File too large. Max 1MB for the MVP.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      addAttachment(session.id, { name: file.name, type: file.type, size: file.size, dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!session) return null;

  const projectColor = project?.color || 'var(--color-grape)';

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Panel */}
      <div
        className={`relative h-full w-full max-w-lg bg-[var(--color-surface)] shadow-[var(--shadow-pop)] transition-transform duration-300 ease-out rounded-l-[var(--radius-lg)] overflow-hidden ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Color accent bar at top matching project */}
        <div className="h-1.5 w-full" style={{ background: projectColor }} />

        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-4">
            <div>
              <h2 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[var(--color-ink)]">
                {session.description || 'Session Detail'}
              </h2>
              <p className="text-xs text-[var(--color-ink-soft)]">{project?.name}</p>
            </div>
            <IconButton aria-label="Close drawer" onClick={handleClose}>
              <X size={20} />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Time Stats */}
            <div className="grid grid-cols-2 gap-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">Start Time</p>
                <p className="mt-1 font-medium text-[var(--color-ink)]">
                  {format(new Date(session.startTime), 'h:mm:ss aaaa')}
                </p>
                <p className="text-xs text-[var(--color-ink-soft)]">{format(new Date(session.startTime), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">End Time</p>
                <p className="mt-1 font-medium text-[var(--color-ink)]">
                  {session.endTime ? format(new Date(session.endTime), 'h:mm:ss aaaa') : 'Running...'}
                </p>
                <p className="text-xs text-[var(--color-ink-soft)]">
                  {session.endTime ? format(new Date(session.endTime), 'MMM d, yyyy') : '-'}
                </p>
              </div>
              <div className="col-span-2 flex items-end justify-between border-t border-[var(--color-line)] pt-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">Total Duration</p>
                  <p className="text-xl font-bold tabular-nums text-[var(--color-ink)]">{formatDuration(session.duration)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">Earnings</p>
                  <p className="text-xl font-bold tabular-nums text-[var(--color-grape)]">
                    {formatCurrency(session.earnings, project?.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Write something about this session..."
                className="mt-2 w-full min-h-[150px] rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-line)] outline-none transition-all resize-none focus:border-[var(--color-grape)] focus:ring-1 focus:ring-[color-mix(in_srgb,var(--color-grape)_20%,transparent)]"
              />
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">Attachments</label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-[var(--color-grape)] hover:opacity-70 transition-opacity"
                >
                  Add File
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                {session.attachments?.map((attachment) => (
                  <div key={attachment.id} className="group relative rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-pop)]">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeAttachment(session.id, attachment.id); }}
                      className="absolute -right-1 -top-1 z-10 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all group-hover:flex"
                    >
                      <X size={12} />
                    </button>
                    {attachment.type.startsWith('image/') ? (
                      <div
                        className="aspect-video w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] cursor-zoom-in"
                        onClick={() => setPreviewImage(attachment.dataUrl)}
                      >
                        <img src={attachment.dataUrl} alt={attachment.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ink-soft)]"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      </div>
                    )}
                    <p className="mt-2 truncate px-1 text-[10px] font-medium text-[var(--color-ink-soft)]">{attachment.name}</p>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-video w-full flex-col items-center justify-center rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-line)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-grape)] hover:text-[var(--color-grape)]"
                >
                  <Plus size={20} />
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-wider">Upload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute right-6 top-6 text-white hover:text-zinc-300 transition-colors">
            <X size={32} />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-full max-w-full rounded-[var(--radius-lg)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
