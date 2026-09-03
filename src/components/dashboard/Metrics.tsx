import { TrendingUp, TrendingDown, Target, Activity, Zap } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { formatCurrency, formatR, dashboardStats } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface MetricProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: typeof TrendingUp;
  emphasis?: 'primary' | 'secondary';
}

export function MetricCard({ label, value, change, positive, icon: Icon, emphasis = 'secondary' }: MetricProps) {
  return (
    <Card className={cn('p-5', emphasis === 'primary' && 'vault-elevated')}>
      <div className="flex items-start justify-between mb-3">
        <SectionLabel>{label}</SectionLabel>
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          positive !== undefined
            ? positive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'
            : 'bg-surface-interactive text-text-tertiary'
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className={cn('font-semibold text-text-primary', emphasis === 'primary' ? 'text-card-lg' : 'text-xl')}>
        {value}
      </div>
      {change && (
        <div className={cn('text-xs mt-1.5 font-medium', positive ? 'text-positive' : positive === false ? 'text-negative' : 'text-text-tertiary')}>
          {change}
        </div>
      )}
    </Card>
  );
}

export function MetricsGrid() {
  const stats = dashboardStats;
  const isPositive = stats.netPnl >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Net P&L"
        value={formatCurrency(stats.netPnl)}
        change={`${stats.wins}W · ${stats.losses}L · ${stats.breakevens}BE`}
        positive={isPositive}
        icon={isPositive ? TrendingUp : TrendingDown}
      />
      <MetricCard
        label="Win Rate"
        value={`${stats.winRate.toFixed(1)}%`}
        change={`${stats.wins} of ${stats.totalTrades} trades`}
        icon={Target}
      />
      <MetricCard
        label="Total Trades"
        value={stats.totalTrades.toString()}
        change="Last 30 days"
        icon={Activity}
      />
      <MetricCard
        label="Average R"
        value={formatR(stats.avgR)}
        change={`Best: ${formatR(stats.bestTrade.rMultiple)}`}
        positive={stats.avgR >= 0}
        icon={Zap}
      />
    </div>
  );
}
