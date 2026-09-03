import { ArrowLeft, ImageIcon, MapPin, Clock, Target, Shield, TrendingUp, Scale, DollarSign } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { DirectionBadge, Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { trades, formatCurrency, formatR, formatDate } from '@/data/mockData';
import { useNav } from '@/navigation/NavProvider';
import { cn } from '@/lib/utils';

export function TradeDetailPage() {
  const { params, navigate } = useNav();
  const trade = trades.find((t) => t.id === params.id) ?? trades[0];

  const isWin = trade.outcome === 'win';
  const isLoss = trade.outcome === 'loss';

  const details = [
    { label: 'Entry', value: trade.entry.toString(), icon: Target },
    { label: 'Exit', value: trade.exit.toString(), icon: TrendingUp },
    { label: 'Stop Loss', value: trade.stopLoss.toString(), icon: Shield },
    { label: 'Take Profit', value: trade.takeProfit.toString(), icon: Target },
    { label: 'Position Size', value: trade.positionSize.toString(), icon: Scale },
    { label: 'Risk', value: formatCurrency(trade.risk), icon: DollarSign },
    { label: 'Reward', value: formatCurrency(trade.reward), icon: TrendingUp },
    { label: 'Session', value: trade.session, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('trades')}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-micro focus-ring rounded-md animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Trades
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
        <div className="flex items-center gap-3">
          <h1 className="text-h1 text-text-primary">{trade.symbol}</h1>
          <DirectionBadge direction={trade.direction} />
        </div>
        <div className="flex items-baseline gap-3">
          <span className={cn(
            'text-display font-semibold',
            isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary'
          )}>
            {formatR(trade.rMultiple)}
          </span>
          <span className={cn('text-h3 font-semibold', isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary')}>
            {formatCurrency(trade.pnl)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-text-tertiary animate-fade-in">
        <span>{formatDate(trade.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <span>·</span>
        <span>{trade.strategy}</span>
      </div>

      {/* Chart / Screenshot */}
      <Card variant="elevated" className="overflow-hidden animate-fade-up">
        <div className="p-5 border-b border-border">
          <SectionLabel>Chart Screenshot</SectionLabel>
        </div>
        {trade.hasScreenshot ? (
          <div className="relative aspect-[16/9] bg-surface-interactive flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-interactive to-surface" />
            <div className="relative text-center">
              <ImageIcon className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <p className="text-sm text-text-secondary">Chart screenshot preview</p>
              <p className="text-xs text-text-tertiary mt-1">Uploaded charts will appear here</p>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No chart attached."
            description="Add the chart that made you take this trade."
            icon={<ImageIcon className="w-5 h-5" />}
            className="bg-surface-interactive/50"
          />
        )}
      </Card>

      {/* Trade Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 animate-fade-up">
          <SectionLabel>Trade Details</SectionLabel>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-5">
            {details.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-interactive flex items-center justify-center text-text-tertiary flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-text-tertiary">{d.label}</div>
                    <div className="text-sm font-medium text-text-primary truncate">{d.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {trade.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-border">
              {trade.tags.map((tag) => (
                <Badge key={tag} tone="neutral">{tag}</Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Analysis */}
        <div className="space-y-6">
          <Card className="p-6 animate-fade-up">
            <SectionLabel>Analysis</SectionLabel>
            <p className="text-sm text-text-secondary mt-4 leading-relaxed">{trade.reasoning}</p>
          </Card>

          <Card className="p-6 animate-fade-up">
            <SectionLabel>Psychology</SectionLabel>
            <p className="text-sm text-text-secondary mt-4 leading-relaxed">{trade.psychology}</p>
          </Card>
        </div>
      </div>

      {/* Reflection */}
      <Card className="p-6 animate-fade-up">
        <SectionLabel>Reflection</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-positive" />
              <span className="text-xs font-medium text-positive uppercase tracking-wider">What went right</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{trade.whatWentRight}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-negative" />
              <span className="text-xs font-medium text-negative uppercase tracking-wider">What went wrong</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{trade.whatWentWrong}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-medium text-accent uppercase tracking-wider">Lesson learned</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{trade.lesson}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
