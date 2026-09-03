import { TrendingUp } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { EquityChart } from '@/components/charts/EquityChart';
import { equityCurve, formatCurrency } from '@/data/mockData';

export function EquityCurveSection() {
  const currentEquity = equityCurve[equityCurve.length - 1].equity;
  const startEquity = equityCurve[0].equity;
  const change = currentEquity - startEquity;
  const changePct = (change / startEquity) * 100;
  const isPositive = change >= 0;

  return (
    <Card variant="elevated" className="p-6 animate-fade-up animate-delay-200 overflow-hidden relative vault-chart-atmosphere">
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <div>
            <SectionLabel>Equity Curve</SectionLabel>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-h2 font-semibold text-text-primary tabular-nums">{formatCurrency(currentEquity)}</span>
              <span className={`text-sm font-medium ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {isPositive ? '+' : ''}{formatCurrency(change)} ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Last 30 days</span>
          </div>
        </div>
        <EquityChart data={equityCurve} height={280} />
      </div>
    </Card>
  );
}
