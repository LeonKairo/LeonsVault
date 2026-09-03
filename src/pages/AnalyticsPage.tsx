import { TrendingUp, Target, Activity, Award, Clock, Zap } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { trades, dashboardStats, formatCurrency, formatR } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function AnalyticsPage() {
  const stats = dashboardStats;

  const bySession = trades.reduce((acc, t) => {
    if (!acc[t.session]) acc[t.session] = { trades: 0, wins: 0, pnl: 0, r: 0 };
    acc[t.session].trades++;
    if (t.outcome === 'win') acc[t.session].wins++;
    acc[t.session].pnl += t.pnl;
    acc[t.session].r += t.rMultiple;
    return acc;
  }, {} as Record<string, { trades: number; wins: number; pnl: number; r: number }>);

  const bySymbol = trades.reduce((acc, t) => {
    if (!acc[t.symbol]) acc[t.symbol] = { trades: 0, wins: 0, pnl: 0, r: 0 };
    acc[t.symbol].trades++;
    if (t.outcome === 'win') acc[t.symbol].wins++;
    acc[t.symbol].pnl += t.pnl;
    acc[t.symbol].r += t.rMultiple;
    return acc;
  }, {} as Record<string, { trades: number; wins: number; pnl: number; r: number }>);

  const byStrategy = trades.reduce((acc, t) => {
    if (!acc[t.strategy]) acc[t.strategy] = { trades: 0, wins: 0, pnl: 0, r: 0 };
    acc[t.strategy].trades++;
    if (t.outcome === 'win') acc[t.strategy].wins++;
    acc[t.strategy].pnl += t.pnl;
    acc[t.strategy].r += t.rMultiple;
    return acc;
  }, {} as Record<string, { trades: number; wins: number; pnl: number; r: number }>);

  const sessions = Object.entries(bySession).sort((a, b) => b[1].pnl - a[1].pnl);
  const symbols = Object.entries(bySymbol).sort((a, b) => b[1].pnl - a[1].pnl);
  const strategies = Object.entries(byStrategy).sort((a, b) => b[1].pnl - a[1].pnl);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-h1 text-text-primary">Analytics</h1>
        <p className="text-sm text-text-secondary mt-1.5">Deep performance breakdown.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total P&L" value={formatCurrency(stats.netPnl)} positive={stats.netPnl >= 0} icon={TrendingUp} />
        <StatCard label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} icon={Target} />
        <StatCard label="Profit Factor" value="2.34" positive icon={Award} />
        <StatCard label="Expectancy" value={formatR(stats.avgR)} positive={stats.avgR >= 0} icon={Zap} />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BreakdownCard title="By Session" data={sessions} icon={Clock} />
        <BreakdownCard title="By Symbol" data={symbols} icon={Activity} />
        <BreakdownCard title="By Strategy" data={strategies} icon={Target} />
      </div>

      {/* Win/Loss distribution */}
      <Card className="p-6 animate-fade-up animate-delay-300">
        <SectionLabel>Outcome Distribution</SectionLabel>
        <div className="mt-5 space-y-4">
          <DistributionBar label="Wins" count={stats.wins} total={stats.totalTrades} tone="positive" />
          <DistributionBar label="Losses" count={stats.losses} total={stats.totalTrades} tone="negative" />
          <DistributionBar label="Breakeven" count={stats.breakevens} total={stats.totalTrades} tone="neutral" />
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value, positive, icon: Icon }: { label: string; value: string; positive?: boolean; icon: typeof TrendingUp }) {
  return (
    <Card className="p-5 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>{label}</SectionLabel>
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          positive !== undefined ? (positive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative') : 'bg-surface-interactive text-text-tertiary'
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className={cn('text-xl font-semibold', positive !== undefined ? (positive ? 'text-positive' : 'text-negative') : 'text-text-primary')}>
        {value}
      </div>
    </Card>
  );
}

function BreakdownCard({ title, data, icon: Icon }: { title: string; data: [string, { trades: number; wins: number; pnl: number; r: number }][]; icon: typeof TrendingUp }) {
  return (
    <Card className="p-6 animate-fade-up">
      <div className="flex items-center gap-2 mb-5">
        <Icon className="w-4 h-4 text-text-tertiary" />
        <SectionLabel>{title}</SectionLabel>
      </div>
      <div className="space-y-3">
        {data.map(([name, stats]) => {
          const winRate = (stats.wins / stats.trades) * 100;
          const isPositive = stats.pnl >= 0;
          return (
            <div key={name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-text-primary truncate">{name}</span>
                <span className={cn('font-semibold', isPositive ? 'text-positive' : 'text-negative')}>
                  {formatCurrency(stats.pnl)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-tertiary">
                <span>{stats.trades} trades</span>
                <span>·</span>
                <span>{winRate.toFixed(0)}% WR</span>
                <span>·</span>
                <span className={isPositive ? 'text-positive' : 'text-negative'}>{formatR(stats.r)}</span>
              </div>
              <div className="h-1 rounded-full bg-surface-interactive overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-structural', isPositive ? 'bg-positive' : 'bg-negative')}
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function DistributionBar({ label, count, total, tone }: { label: string; count: number; total: number; tone: 'positive' | 'negative' | 'neutral' }) {
  const pct = (count / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          <Badge tone={tone}>{count}</Badge>
        </div>
        <span className="text-sm text-text-tertiary">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-interactive overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-structural ease-premium',
            tone === 'positive' ? 'bg-positive' : tone === 'negative' ? 'bg-negative' : 'bg-text-tertiary',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
