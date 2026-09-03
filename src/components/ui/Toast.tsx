import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

let toastId = 0;
const listeners: Array<(toasts: Toast[]) => void> = [];
let currentToasts: Toast[] = [];

export function showToast(type: ToastType, message: string) {
  const id = `toast-${++toastId}`;
  currentToasts = [...currentToasts, { id, type, message }];
  listeners.forEach((fn) => fn(currentToasts));
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn(currentToasts));
  }, 3500);
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-positive" />,
  info: <Info className="w-4 h-4 text-accent" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  error: <XCircle className="w-4 h-4 text-negative" />,
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const dismiss = (id: string) => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn(currentToasts));
  };

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg vault-elevated shadow-elevated dark:shadow-dark-elevated animate-slide-right pointer-events-auto min-w-[280px] max-w-[400px]',
          )}
        >
          {icons[t.type]}
          <span className="text-sm text-text-primary flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="text-text-tertiary hover:text-text-primary transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
}
