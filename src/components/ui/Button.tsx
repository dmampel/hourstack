import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

const variantClasses = {
  primary:
    'bg-[var(--color-grape)] text-white hover:opacity-90 active:opacity-80 disabled:opacity-40',
  secondary:
    'border border-[var(--color-line)] text-[var(--color-ink)] bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-line)] disabled:opacity-40',
  ghost:
    'text-[var(--color-ink-soft)] bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-line)] disabled:opacity-40',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs font-semibold',
  md: 'px-4 py-2.5 text-sm font-semibold',
  lg: 'px-6 py-3 text-base font-semibold',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] transition-all cursor-pointer disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
