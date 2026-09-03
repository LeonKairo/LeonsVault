import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { accounts, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function AccountSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(accounts[0]);
  const current = accounts.find((a) => a.id === selected.id) ?? accounts[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 h-10 px-3 rounded-lg vault-surface hover:border-border-strong transition-colors duration-micro focus-ring"
      >
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: current.color }} />
        <div className="text-left min-w-0">
          <div className="text-sm font-medium text-text-primary truncate max-w-[160px]">{current.name}</div>
          <div className="text-[0.6875rem] text-text-tertiary">{formatCurrency(current.equity)} · {current.type}</div>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-text-tertiary transition-transform duration-micro', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 right-0 w-72 z-50 vault-elevated rounded-xl shadow-elevated dark:shadow-dark-elevated border border-border p-1.5 animate-fade-in">
            <div className="px-2.5 py-2">
              <span className="text-[0.6875rem] text-text-tertiary uppercase tracking-[0.12em] font-medium">Trading Accounts</span>
            </div>
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  setSelected(acc);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm transition-colors duration-micro text-left',
                  acc.id === current.id
                    ? 'bg-surface-interactive'
                    : 'hover:bg-surface-interactive',
                )}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: acc.color }} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-text-primary truncate">{acc.name}</div>
                  <div className="text-xs text-text-tertiary">{acc.broker} · {acc.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-text-primary">{formatCurrency(acc.equity)}</div>
                </div>
                {acc.id === current.id && <Check className="w-4 h-4 text-accent flex-shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
