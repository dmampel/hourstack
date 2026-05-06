'use client';

import { useState, useEffect, useRef } from 'react';
import { Session, Attachment } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

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

  // Sync notes when session changes
  useEffect(() => {
    if (session) {
      setNotes(session.notes || '');
    }
  }, [session?.id]);

  // Save notes on blur
  const handleNotesBlur = () => {
    if (session && notes !== session.notes) {
      updateSession(session.id, { notes });
    }
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
      addAttachment(session.id, {
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
      });
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

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div 
        className={`relative h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">{session.description || 'Session Detail'}</h2>
              <p className="text-xs text-zinc-500">{project?.name}</p>
            </div>
            <button 
              onClick={handleClose}
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Time Stats Section */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-zinc-50 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Start Time</p>
                <p className="mt-1 font-medium text-zinc-900">
                  {format(new Date(session.startTime), 'h:mm:ss aaaa')}
                </p>
                <p className="text-xs text-zinc-500">{format(new Date(session.startTime), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">End Time</p>
                <p className="mt-1 font-medium text-zinc-900">
                  {session.endTime ? format(new Date(session.endTime), 'h:mm:ss aaaa') : 'Running...'}
                </p>
                <p className="text-xs text-zinc-500">
                  {session.endTime ? format(new Date(session.endTime), 'MMM d, yyyy') : '-'}
                </p>
              </div>
              <div className="col-span-2 pt-2 border-t border-zinc-200 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Duration</p>
                  <p className="text-xl font-bold text-zinc-900 tabular-nums">{formatDuration(session.duration)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Earnings</p>
                  <p className="text-xl font-bold text-indigo-600 tabular-nums">
                    {formatCurrency(session.earnings, project?.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Write something about this session..."
                className="mt-2 w-full min-h-[150px] rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700 placeholder:text-zinc-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Attachments Section */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Attachments</label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
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
                  <div key={attachment.id} className="group relative rounded-xl border border-zinc-100 bg-white p-2 shadow-sm transition-all hover:shadow-md">
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeAttachment(session.id, attachment.id); }}
                      className="absolute -right-1 -top-1 z-10 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all group-hover:flex"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    
                    {attachment.type.startsWith('image/') ? (
                      <div 
                        className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 cursor-zoom-in"
                        onClick={() => setPreviewImage(attachment.dataUrl)}
                      >
                        <img src={attachment.dataUrl} alt={attachment.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-zinc-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="zinc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                      </div>
                    )}
                    <p className="mt-2 truncate text-[10px] font-medium text-zinc-600 px-1">{attachment.name}</p>
                  </div>
                ))}

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-100 text-zinc-300 transition-colors hover:border-indigo-200 hover:text-indigo-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-wider">Upload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute right-6 top-6 text-white hover:text-zinc-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-h-full max-w-full rounded-lg shadow-2xl transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
