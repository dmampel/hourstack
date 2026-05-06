'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { isToday } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, formatCurrency } from '@/lib/utils';
import Timer from '@/components/features/sessions/Timer';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', Icon: FolderKanban },
];

function RecentProjects() {
  const projects = useAppStore((s) => s.projects);
  const sessions = useAppStore((s) => s.sessions);

  const withTime = projects
    .map((p) => {
      const secs = sessions
        .filter((s) => s.projectId === p.id)
        .reduce((sum, s) => sum + s.duration, 0);
      return { ...p, secs };
    })
    .filter((p) => p.secs > 0)
    .sort((a, b) => b.secs - a.secs)
    .slice(0, 4);

  if (withTime.length === 0) return null;

  return (
    <div className="px-4 pb-4">
      <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Recent Projects</p>
      <div className="space-y-1">
        {withTime.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="group flex items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2 transition-colors hover:bg-[var(--color-surface-muted)]"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: p.color ?? 'var(--color-grape)' }}
            />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--color-ink)]">{p.name}</span>
            <span className="shrink-0 text-xs tabular-nums text-[var(--color-ink-soft)]">{formatDuration(p.secs)}</span>
            <ExternalLink size={12} className="shrink-0 opacity-0 text-[var(--color-ink-soft)] transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function MiniStats() {
  const projects = useAppStore((s) => s.projects);
  const sessions = useAppStore((s) => s.sessions);

  const todaySessions = sessions.filter((s) => isToday(new Date(s.startTime)));
  const todaySeconds = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const todayEarnings = todaySessions.reduce((sum, s) => sum + s.earnings, 0);

  const pendingTotal = sessions
    .filter((s) => !s.isPaid)
    .reduce((sum, s) => sum + s.earnings, 0);

  const currency = projects[0]?.currency ?? 'USD';

  return (
    <div className="space-y-2 px-4 pb-4">
      <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">Today</p>
      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-0.5 rounded-[var(--radius-md)] p-3" style={{ background: 'color-mix(in srgb, var(--color-grape) 10%, white)' }}>
          <Clock size={14} style={{ color: 'var(--color-grape)' }} />
          <span className="mt-1 text-base font-semibold tabular-nums text-[var(--color-ink)]">{formatDuration(todaySeconds)}</span>
          <span className="text-[10px] text-[var(--color-ink-soft)]">Time tracked</span>
        </div>
        <div className="flex flex-1 flex-col gap-0.5 rounded-[var(--radius-md)] p-3" style={{ background: 'color-mix(in srgb, var(--color-tangerine) 10%, white)' }}>
          <DollarSign size={14} style={{ color: 'var(--color-tangerine)' }} />
          <span className="mt-1 text-base font-semibold tabular-nums text-[var(--color-ink)]">{formatCurrency(todayEarnings, currency)}</span>
          <span className="text-[10px] text-[var(--color-ink-soft)]">Earned</span>
        </div>
      </div>
      {pendingTotal > 0 && (
        <div className="rounded-[var(--radius-md)] p-3" style={{ background: 'color-mix(in srgb, var(--color-lime) 15%, white)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--color-lime) 60%, #1B1A22)' }}>Pending payment</p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--color-ink)]">{formatCurrency(pendingTotal, currency)}</p>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="flex w-72 min-h-full flex-col border-r border-[var(--color-line)] bg-[var(--color-surface)]">
        {/* Logo */}
        <div className="px-6 py-5">
          <Link
            href="/dashboard"
            className="block font-[family-name:var(--font-fraunces)] text-2xl font-semibold leading-none"
            style={{
              background: 'var(--gradient-brand)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Hourstack
          </Link>
        </div>

        {/* Nav */}
        <nav className="px-3 pb-4">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`relative mb-1 flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[color-mix(in_srgb,var(--color-grape)_12%,var(--color-surface))] text-[var(--color-grape)]'
                    : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[var(--color-grape)]" aria-hidden="true" />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-[var(--color-line)]" />

        {/* Timer widget */}
        <div className="p-4">
          <Timer />
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-[var(--color-line)]" />

        {/* Mini stats */}
        <div className="pt-4">
          <MiniStats />
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-[var(--color-line)]" />

        {/* Recent projects */}
        <div className="pt-4">
          <RecentProjects />
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[var(--color-line)] bg-[var(--color-surface)] md:hidden">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-[var(--color-grape)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-b-full bg-[var(--color-grape)]" aria-hidden="true" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
