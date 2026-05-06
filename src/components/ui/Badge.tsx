import type { ReactNode } from 'react';

type BadgeTone = 'grape' | 'tangerine' | 'lime' | 'blush' | 'sky' | 'default';

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  grape: 'bg-[color-mix(in_srgb,var(--color-grape)_16%,white)] text-[var(--color-grape)]',
  tangerine: 'bg-[color-mix(in_srgb,var(--color-tangerine)_16%,white)] text-[var(--color-tangerine)]',
  lime: 'bg-[color-mix(in_srgb,var(--color-lime)_30%,white)] text-[color-mix(in_srgb,var(--color-lime)_60%,#1B1A22)]',
  blush: 'bg-[color-mix(in_srgb,var(--color-blush)_16%,white)] text-[var(--color-blush)]',
  sky: 'bg-[color-mix(in_srgb,var(--color-sky)_20%,white)] text-[color-mix(in_srgb,var(--color-sky)_80%,#1B1A22)]',
  default: 'bg-[var(--color-surface-muted)] text-[var(--color-ink-soft)]',
};

/** Maps project currency to a badge tone */
export function currencyTone(currency: 'ARS' | 'USD'): BadgeTone {
  return currency === 'ARS' ? 'blush' : 'lime';
}

export default function Badge({ children, tone = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
