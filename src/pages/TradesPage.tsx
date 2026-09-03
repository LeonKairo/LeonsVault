import { useState, useMemo } from 'react';
import { Search, LayoutGrid, Table as TableIcon, ArrowUpRight, ArrowDownRight, Filter, X } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { DirectionBadge, Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { trades, formatCurrency, formatR, formatRelativeDate } from '@/data/mockData';
import { useNav } from '@/navigation/NavProvider';
import { cn } from '@/lib/utils';
import type { Trade } from '@/types';

type ViewMode = 'grid' | 'table';

const symbolOptions = [
  { value: 'all', label: 'All Symbols' },
  ...['XAUUSD', 'EURUSD', 'GBPJPY', 'USDJPY', 'US30', 'NAS100', 'BTCUSD', 'AUDUSD'].map((s) => ({ value: s, label: s })),
];

const directionOptions = [
  { value: 'all', label: 'All Directions' },
  { value: 'LONG', label: 'Long' },
  { value: 'SHORT', label: 'Short' },
];

const outcomeOptions = [
  { value: 'all', label: 'All Results' },
  { value: 'win', label: 'Wins' },
  { value: 'loss', label: 'Losses' },
  { value: 'breakeven', label: 'Breakeven' },
];

const strategyOptions = [
  { value: 'all', label: 'All Strategies' },
  ...['London Sweep', 'NY Open Drive', 'Liquidity Grab', 'Breakout Retest', 'Trend Pullback', 'Range Reversal'].map((s) => ({ value: s, label: s })),
];

export function TradesPage() {
  const { navigate } = useNav();
  const [view, setView] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [symbol, setSymbol] = useState('all');
  const [direction, setDirection] = useState('all');
  const [outcome, setOutcome] = useState('all');
  const [strategy, setStrategy] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return trades
      .filter((t) => {
        if (search) {
          const s = search.toLowerCase();
          if (!t.symbol.toLowerCase().includes(s) && !t.strategy.toLowerCase().includes(s) && !t.tags.some((tag) => tag.toLowerCase().includes(s))) return false;
        }
        if (symbol !== 'all' && t.symbol !== symbol) return false;
        if (direction !== 'all' && t.direction !== direction) return false;
        if (outcome !== 'all' && t.outcome !== outcome) return false;
        if (strategy !== 'all' && t.strategy !== strategy) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search, symbol, direction, outcome, strategy]);

  const hasActiveFilters = symbol !== 'all' || direction !== 'all' || outcome !== 'all' || strategy !== 'all' || search !== '';

  const clearFilters = () => {
    setSearch('');
    setSymbol('all');
    setDirection('all');
    setOutcome('all');
    setStrategy('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-h1 text-text-primary">Trades</h1>
        <p className="text-sm text-text-secondary mt-1.5">Every decision. Every result. Nothing forgotten.</p>
      </div>

      {/* Controls */}
      <div className="space-y-3 animate-fade-up">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by symbol, strategy, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'h-10 px-3.5 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors duration-micro focus-ring',
                showFilters || hasActiveFilters
                  ? 'vault-surface text-text-primary border-border-strong'
                  : 'vault-surface text-text-secondary hover:text-text-primary border-border',
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </button>

            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-border vault-surface p-0.5">
              <button
                onClick={() => setView('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors duration-micro focus-ring',
                  view === 'grid' ? 'bg-surface-interactive text-text-primary' : 'text-text-tertiary hover:text-text-secondary',
                )}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('table')}
                className={cn(
                  'p-2 rounded-md transition-colors duration-micro focus-ring',
                  view === 'table' ? 'bg-surface-interactive text-text-primary' : 'text-text-tertiary hover:text-text-secondary',
                )}
                title="Table view"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2 animate-fade-down">
            <Select value={symbol} options={symbolOptions} onChange={setSymbol} compact />
            <Select value={direction} options={directionOptions} onChange={setDirection} compact />
            <Select value={outcome} options={outcomeOptions} onChange={setOutcome} compact />
            <Select value={strategy} options={strategyOptions} onChange={setStrategy} compact />
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="h-8 px-3 rounded-md text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1.5"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between animate-fade-in">
        <span className="text-sm text-text-tertiary">
          {filtered.length} {filtered.length === 1 ? 'trade' : 'trades'}
        </span>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="Your vault is empty."
            description="No trades match these filters. Try adjusting your search or clear all filters."
            icon={<Search className="w-5 h-5" />}
            action={
              hasActiveFilters ? (
                <button onClick={clearFilters} className="text-sm text-accent hover:text-accent/80 transition-colors font-medium">
                  Clear all filters
                </button>
              ) : undefined
            }
          />
        </Card>
      ) : view === 'grid' ? (
        <div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {filtered.map((trade, i) => (
            <TradeCard key={trade.id} trade={trade} onClick={() => navigate('trade-detail', { id: trade.id })} index={i} />
          ))}
        </div>
      ) : (
        <Card key="table" className="overflow-hidden animate-fade-in">
          <TradeTable trades={filtered} onRowClick={(id) => navigate('trade-detail', { id })} />
        </Card>
      )}
    </div>
  );
}

function TradeCard({ trade, onClick, index }: { trade: Trade; onClick: () => void; index: number }) {
  const isWin = trade.outcome === 'win';
  const isLoss = trade.outcome === 'loss';

  return (
    <Card
      variant="interactive"
      hover
      onClick={onClick}
      className="p-5 cursor-pointer animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-xs',
            isWin ? 'bg-positive/10 text-positive' : isLoss ? 'bg-negative/10 text-negative' : 'bg-surface-interactive text-text-secondary'
          )}>
            {trade.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="font-semibold text-sm text-text-primary">{trade.symbol}</div>
            <div className="text-xs text-text-tertiary">{trade.strategy}</div>
          </div>
        </div>
        <DirectionBadge direction={trade.direction} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className={cn(
            'text-xl font-semibold',
            isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary'
          )}>
            {formatR(trade.rMultiple)}
          </div>
          <div className="text-xs text-text-tertiary mt-0.5">{formatRelativeDate(trade.date)}</div>
        </div>
        <div className="text-right">
          <div className={cn(
            'text-sm font-semibold flex items-center gap-0.5 justify-end',
            isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary'
          )}>
            {(isWin ? <ArrowUpRight className="w-3.5 h-3.5" /> : isLoss ? <ArrowDownRight className="w-3.5 h-3.5" /> : null)}
            {formatCurrency(trade.pnl)}
          </div>
          <div className="text-xs text-text-tertiary mt-0.5">{trade.session}</div>
        </div>
      </div>

      {trade.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border">
          {trade.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} tone="neutral">{tag}</Badge>
          ))}
        </div>
      )}
    </Card>
  );
}

function TradeTable({ trades, onRowClick }: { trades: Trade[]; onRowClick: (id: string) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-[0.6875rem] font-medium uppercase tracking-wider text-text-tertiary px-5 py-3">Symbol</th>
            <th className="text-left text-[0.6875rem] font-medium uppercase tracking-wider text-text-tertiary px-5 py-3 hidden sm:table-cell">Direction</th>
            <th className="text-left text-[0.6875rem] font-medium uppercase tracking-wider text-text-tertiary px-5 py-3 hidden md:table-cell">Strategy</th>
            <th className="text-left text-[0.6875rem] font-medium uppercase tracking-wider text-text-tertiary px-5 py-3 hidden lg:table-cell">Session</th>
            <th className="text-right text-[0.6875rem] font-medium uppercase tracking-wider text-text-tertiary px-5 py-3">R</th>
            <th className="text-right text-[0.6875rem] font-medium uppercase tracking-wider text-text-tertiary px-5 py-3">P&L</th>
            <th className="text-right text-[0.6875rem] font-medium uppercase tracking-wider text-text-tertiary px-5 py-3 hidden sm:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => {
            const isWin = trade.outcome === 'win';
            const isLoss = trade.outcome === 'loss';
            return (
              <tr
                key={trade.id}
                onClick={() => onRowClick(trade.id)}
                className="border-b border-border last:border-0 hover:bg-surface-interactive vault-quiet-hover cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <span className="font-semibold text-sm text-text-primary">{trade.symbol}</span>
                </td>
                <td className="px-5 py-3.5 hidden sm:table-cell">
                  <DirectionBadge direction={trade.direction} />
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <span className="text-sm text-text-secondary">{trade.strategy}</span>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className="text-sm text-text-secondary">{trade.session}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className={cn('text-sm font-semibold', isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary')}>
                    {formatR(trade.rMultiple)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className={cn('text-sm font-semibold', isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary')}>
                    {formatCurrency(trade.pnl)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                  <span className="text-sm text-text-tertiary">{formatRelativeDate(trade.date)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
