'use client';

import { Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

export default function UserFooter() {
  const name = useAppStore((s) => s.settings.name);
  const email = 'delfina@example.com';

  return (
    <div className="mt-auto border-t border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface-muted)_50%,var(--color-surface))] px-4 py-4">
      <div className="flex items-center gap-3">
        {/* Avatar Placeholder */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gradient-brand)] text-white shadow-[var(--shadow-soft)]">
          <User size={18} />
        </div>
        
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">{name}</p>
          <p className="truncate text-[10px] text-[var(--color-ink-soft)]">{email}</p>
        </div>

        <Link 
          href="/settings"
          className="rounded-md p-1.5 text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]"
          title="Settings"
        >
          <Settings size={18} />
        </Link>
      </div>
    </div>
  );
}
