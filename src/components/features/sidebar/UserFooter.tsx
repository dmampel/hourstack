'use client';

import { Settings, LogOut, User } from 'lucide-react';

export default function UserFooter() {
  // In a real app, these would come from an auth store
  const user = {
    name: 'Delfina Mampel',
    email: 'delfina@example.com',
  };

  return (
    <div className="mt-auto border-t border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface-muted)_50%,var(--color-surface))] px-4 py-4">
      <div className="flex items-center gap-3">
        {/* Avatar Placeholder */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gradient-brand)] text-white shadow-[var(--shadow-soft)]">
          <User size={18} />
        </div>
        
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">{user.name}</p>
          <p className="truncate text-[10px] text-[var(--color-ink-soft)]">{user.email}</p>
        </div>

        <button 
          className="rounded-md p-1.5 text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]"
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
