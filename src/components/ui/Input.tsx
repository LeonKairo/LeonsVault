import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, icon, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">{icon}</span>}
        <input
          ref={ref}
          className={cn(
            'w-full h-10 rounded-lg vault-surface px-3.5 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-micro focus-ring',
            icon ? 'pl-10' : '',
            className,
          )}
          {...props}
        />
      </div>
    </div>
  ),
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg vault-surface p-3.5 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-micro focus-ring resize-none',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Textarea.displayName = 'Textarea';
