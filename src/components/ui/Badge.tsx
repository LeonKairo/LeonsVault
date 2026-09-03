import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'positive' | 'negative' | 'neutral' | 'accent' | 'warning';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  positive: 'bg-positive/10 text-positive border-positive/20',
  negative: 'bg-negative/10 text-negative border-negative/20',
  neutral: 'bg-surface-interactive text-text-secondary border-border',
  accent: 'bg-accent/10 text-accent border-accent/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
};

export function Badge({ className = '', tone = 'neutral', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function DirectionBadge({ direction }: { direction: 'LONG' | 'SHORT' }) {
  const isLong = direction === 'LONG';
  return (
    <Badge tone={isLong ? 'positive' : 'negative'}>
      {isLong ? '▲' : '▼'} {direction}
    </Badge>
  );
}
