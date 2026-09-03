import { type HTMLAttributes, forwardRef } from 'react';

type Variant = 'default' | 'elevated' | 'interactive';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  hover?: boolean;
}

const variants: Record<Variant, string> = {
  // L0 — Static: no hover effects, no shadow change
  default: 'vault-surface',
  // L0+ — Elevated: shadow depth, still static unless hover prop
  elevated: 'vault-elevated shadow-soft dark:shadow-dark-soft',
  // L2 — Interactive: controlled hover for navigation/action cards
  interactive: 'vault-surface cursor-pointer vault-action-hover hover:border-border-strong hover:shadow-soft dark:hover:shadow-dark-soft',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hover, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl ${variants[variant]} ${hover ? 'vault-action-hover hover:border-border-strong hover:shadow-soft dark:hover:shadow-dark-soft' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
);
Card.displayName = 'Card';

interface SectionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  uppercase?: boolean;
}

export function SectionLabel({ className = '', uppercase = true, children, ...props }: SectionLabelProps) {
  return (
    <span
      className={`text-text-tertiary font-medium ${uppercase ? 'uppercase' : ''} text-[0.6875rem] tracking-[0.12em] ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
