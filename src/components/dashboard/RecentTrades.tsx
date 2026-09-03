import { ArrowUpRight, ArrowDownRight, ImageIcon } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { DirectionBadge } from '@/components/ui/Badge';
import { trades, formatCurrency, formatR, formatRelativeDate } from '@/data/mockData';
import { useNav } from '@/navigation/NavProvider';
import { cn } from '@/lib/utils';

export function RecentTrades() {
  const { navigate } = useNav();
  const recent = [...trades]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <Card className="p-6 animate-fade-up animate-delay-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <SectionLabel>Recent Trades</SectionLabel>
          <h3 className="text-h3 text-text-primary mt-1.5">Latest from your vault</h3>
        </div>
        <button
          onClick={() => navigate('trades')}
          className="text-sm text-text-secondary hover:text-accent transition-colors duration-micro font-medium"
        >
          View all
        </button>
      </div>

      <div className="space-y-1">
        {recent.map((trade) => {
          const isWin = trade.outcome === 'win';
          const isLoss = trade.outcome === 'loss';
          return (
            <button
              key={trade.id}
              onClick={() => navigate('trade-detail', { id: trade.id })}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-surface-interactive vault-quiet-hover text-left group focus-ring"
            >
              {/* Screenshot / placeholder */}
              <div className="w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center bg-surface-interactive border border-border overflow-hidden">
                {trade.hasScreenshot ? (
                  <ImageIcon className="w-4 h-4 text-text-tertiary" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-text-tertiary/30" />
                )}
              </div>

              {/* Symbol + direction */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-text-primary">{trade.symbol}</span>
                  <DirectionBadge direction={trade.direction} />
                </div>
                <div className="text-xs text-text-tertiary mt-0.5">
                  {trade.strategy} · {trade.session} · {formatRelativeDate(trade.date)}
                </div>
              </div>

              {/* R Multiple */}
              <div className="text-right hidden sm:block">
                <div className={cn(
                  'text-sm font-semibold',
                  isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary'
                )}>
                  {formatR(trade.rMultiple)}
                </div>
                <div className="text-[0.6875rem] text-text-tertiary uppercase tracking-wider">R</div>
              </div>

              {/* P&L */}
              <div className="text-right w-20">
                <div className={cn(
                  'text-sm font-semibold flex items-center justify-end gap-0.5',
                  isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary'
                )}>
                  {(isWin ? <ArrowUpRight className="w-3.5 h-3.5" /> : isLoss ? <ArrowDownRight className="w-3.5 h-3.5" /> : null)}
                  {formatCurrency(trade.pnl)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
