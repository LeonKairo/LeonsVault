import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  subtitle?: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
  compact?: boolean;
}

export function Select({ value, options, onChange, className, compact }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border vault-surface hover:border-border-strong transition-colors duration-micro focus-ring',
          compact ? 'h-8 px-3 text-xs' : 'h-10 px-3.5 text-sm',
        )}
      >
        {current?.icon}
        <span className="text-text-primary font-medium truncate">{current?.label}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-text-tertiary transition-transform duration-micro', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 right-0 min-w-full z-50 vault-elevated rounded-lg shadow-elevated dark:shadow-dark-elevated border border-border p-1 animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-micro text-left',
                opt.value === value
                  ? 'bg-surface-interactive text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-interactive',
              )}
            >
              {opt.icon}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{opt.label}</div>
                {opt.subtitle && <div className="text-xs text-text-tertiary truncate">{opt.subtitle}</div>}
              </div>
              {opt.value === value && <Check className="w-4 h-4 text-accent flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
