'use client';

import { Sparkles, Zap, Box, Paintbrush, CheckCircle, Flag } from 'lucide-react';
import { ProjectStatus } from '@/types';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; Icon: any }> = {
  'just-started': { label: 'Just Started', color: '#94a3b8', Icon: Sparkles }, // Slate 400
  'in-progress': { label: 'In Progress', color: '#38bdf8', Icon: Zap }, // Sky 400
  'mvp': { label: 'MVP Phase', color: '#4ade80', Icon: Box }, // Green 400
  'polishing': { label: 'Polishing', color: '#fbbf24', Icon: Paintbrush }, // Amber 400
  'almost-done': { label: 'Almost Done', color: '#818cf8', Icon: CheckCircle }, // Indigo 400
  'completed': { label: 'Completed', color: '#2dd4bf', Icon: Flag }, // Teal 400
};

interface StatusBadgeProps {
  status: ProjectStatus;
  showIcon?: boolean;
  className?: string;
}

export default function StatusBadge({ status, showIcon = true, className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['just-started'];
  const { label, color, Icon } = config;

  return (
    <div 
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${className}`}
      style={{ 
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
        color: color,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`
      }}
    >
      {showIcon && <Icon size={10} strokeWidth={3} />}
      {label}
    </div>
  );
}
