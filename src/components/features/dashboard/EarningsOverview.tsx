'use client';

import { useAppStore } from '@/store/useAppStore';
import { formatCurrency } from '@/lib/utils';

function CurrencyBalance({
  label,
  currency,
  paid,
  pending,
}: {
  label: string;
  currency: 'ARS' | 'USD';
  paid: number;
  pending: number;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)] mb-3">{label}</p>
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-2xl font-bold text-[var(--color-ink)] tabular-nums">
          {formatCurrency(paid + pending, currency)}
        </span>
        <span className="text-xs font-medium text-[var(--color-ink-soft)]">Total Balance</span>
      </div>
      <div className="space-y-2 pt-3 border-t border-[var(--color-line)]">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-ink-soft)]">Paid</span>
          <span className="font-semibold text-[var(--color-lime)]" style={{ color: 'color-mix(in srgb, var(--color-lime) 70%, #1B1A22)' }}>{formatCurrency(paid, currency)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-ink-soft)]">Pending</span>
          <span className="font-semibold text-[var(--color-tangerine)]">{formatCurrency(pending, currency)}</span>
        </div>
      </div>
    </div>
  );
}

export default function EarningsOverview() {
  const projects = useAppStore((state) => state.projects);
  const sessions = useAppStore((state) => state.sessions);

  const getStats = (curr: 'ARS' | 'USD') => {
    const paid = sessions.reduce((sum, s) => {
      const p = projects.find((proj) => proj.id === s.projectId);
      return p?.currency === curr && s.isPaid ? sum + s.earnings : sum;
    }, 0);
    const pending = sessions.reduce((sum, s) => {
      const p = projects.find((proj) => proj.id === s.projectId);
      return p?.currency === curr && !s.isPaid ? sum + s.earnings : sum;
    }, 0);
    return { paid, pending };
  };

  const usd = getStats('USD');
  const ars = getStats('ARS');

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-soft)]">
        Currency Balances
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {usd.paid + usd.pending > 0 && (
          <CurrencyBalance label="US Dollars" currency="USD" paid={usd.paid} pending={usd.pending} />
        )}
        {ars.paid + ars.pending > 0 && (
          <CurrencyBalance label="Argentine Pesos" currency="ARS" paid={ars.paid} pending={ars.pending} />
        )}
      </div>
    </div>
  );
}
