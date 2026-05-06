import type { ElementType, ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  tone?: 'plain' | 'tinted';
  accent?: string;
  padding?: 'sm' | 'md' | 'lg';
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  tone = 'plain',
  accent,
  padding = 'md',
  as: Tag = 'div',
  className = '',
  style,
}: CardProps) {
  const tintStyle: CSSProperties =
    tone === 'tinted' && accent
      ? { background: `color-mix(in srgb, ${accent} 14%, var(--color-surface))` }
      : {};

  return (
    <Tag
      className={`rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] ${paddingMap[padding]} ${className}`}
      style={{ ...tintStyle, ...style }}
    >
      {children}
    </Tag>
  );
}
