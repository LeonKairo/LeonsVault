import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  // L3 — Primary/signature: tonal gradient + controlled glow
  primary:
    'vault-primary-glow text-bg font-semibold',
  // L2 — Standard action: restrained surface
  secondary:
    'vault-surface text-text-primary hover:border-border-strong hover:bg-surface-interactive active:bg-surface-interactive vault-action-hover',
  // L1 — Quiet interactive
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-surface-interactive vault-quiet-hover',
  // L2 — Danger
  danger:
    'bg-negative/10 text-negative hover:bg-negative/15 active:bg-negative/20 vault-action-hover',
  // L3 — Signature (Seal Session, Show Me The Truth)
  gold:
    'vault-signature-glow text-accent font-semibold',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-sm gap-2.5 rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'secondary', size = 'md', loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium focus-ring disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
