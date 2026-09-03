import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { accounts, formatCurrency, dashboardStats } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function HeroEquity() {
  const account = accounts[0];
  const change = account.equity - account.balance;
  const changePct = (change / account.balance) * 100;
  const isPositive = change >= 0;
  const todayChange = dashboardStats.todayPnl;
  const todayPositive = todayChange >= 0;

  return (
    <Card variant="elevated" className="p-7 animate-fade-up overflow-hidden relative vault-atmosphere vault-edge-luminous">
      <div className="relative z-10">
        <SectionLabel>Account Equity</SectionLabel>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-display font-semibold text-text-primary tabular-nums">
            {formatCurrency(account.equity)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              todayPositive ? 'text-positive' : 'text-negative'
            )}>
              {todayPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {todayPositive ? '+' : ''}{formatCurrency(todayChange)} today
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-medium',
              isPositive ? 'text-positive' : 'text-negative'
            )}>
              {isPositive ? '+' : ''}{formatCurrency(change)}
            </span>
            <span className="text-sm text-text-tertiary">
              ({isPositive ? '+' : ''}{changePct.toFixed(2)}% overall)
            </span>
          </div>
        </div>

        {/* Mini progress bar showing equity vs balance */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-text-tertiary mb-2">
            <span>Starting balance: {formatCurrency(account.balance)}</span>
            <span>Current equity</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-interactive overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-cinematic ease-premium',
                isPositive ? 'bg-positive' : 'bg-negative'
              )}
              style={{
                width: `${Math.min((account.equity / (account.balance * 1.1)) * 100, 100)}%`,
                boxShadow: isPositive
                  ? '0 0 8px rgb(var(--positive-glow) / 0.4)'
                  : '0 0 8px rgb(var(--negative-glow) / 0.4)',
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
