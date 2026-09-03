import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { DirectionBadge } from '@/components/ui/Badge';
import { trades, formatCurrency, formatR } from '@/data/mockData';
import { useNav } from '@/navigation/NavProvider';
import { cn } from '@/lib/utils';
import type { CalendarDay, Trade } from '@/types';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function todayInfo() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
}

interface DayAgg {
  pnl: number;
  r: number;
  trades: number;
  wins: number;
}

function aggregateTradesByDay(monthTrades: Trade[]): Record<number, DayAgg> {
  const map: Record<number, DayAgg> = {};
  for (const t of monthTrades) {
    const d = new Date(t.date);
    const day = d.getDate();
    if (!map[day]) map[day] = { pnl: 0, r: 0, trades: 0, wins: 0 };
    map[day].pnl += t.pnl;
    map[day].r += t.rMultiple;
    map[day].trades += 1;
    if (t.outcome === 'win') map[day].wins += 1;
  }
  return map;
}

function buildCalendarDays(year: number, month: number, allTrades: Trade[]): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();

  const monthTrades = allTrades.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const dayMap = aggregateTradesByDay(monthTrades);

  for (let i = 0; i < startWeekday; i++) {
    const prevDate = new Date(year, month, -startWeekday + i + 1);
    days.push({
      date: prevDate.toISOString(),
      day: prevDate.getDate(),
      status: 'no-trade',
      pnl: 0,
      rMultiple: 0,
      trades: 0,
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    const agg = dayMap[d];
    let status: CalendarDay['status'] = 'no-trade';
    if (agg) {
      if (agg.pnl > 0) status = 'positive';
      else if (agg.pnl < 0) status = 'negative';
      else status = 'neutral';
    }
    days.push({
      date: date.toISOString(),
      day: d,
      status,
      pnl: agg?.pnl ?? 0,
      rMultiple: agg?.r ?? 0,
      trades: agg?.trades ?? 0,
      isCurrentMonth: true,
    });
  }

  return days;
}

export function CalendarPage() {
  const { navigate } = useNav();
  const today = todayInfo();
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);
  const [selectedKey, setSelectedKey] = useState<string | null>(
    `${today.year}-${today.month}-${today.day}`,
  );

  const days = useMemo(() => buildCalendarDays(viewYear, viewMonth, trades), [viewYear, viewMonth]);

  const currentMonthDays = days.filter((d) => d.isCurrentMonth);
  const tradingDaysList = currentMonthDays.filter((d) => d.trades > 0);

  const monthTrades = trades.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
  });

  // Per-day aggregation for tooltip win rate
  const dayAggMap = useMemo(() => aggregateTradesByDay(monthTrades), [monthTrades]);

  const monthPnl = monthTrades.reduce((sum, t) => sum + t.pnl, 0);
  const monthWins = monthTrades.filter((t) => t.outcome === 'win').length;
  const monthWinRate = monthTrades.length > 0 ? (monthWins / monthTrades.length) * 100 : 0;
  const tradingDaysCount = tradingDaysList.length;
  const totalDays = currentMonthDays.length;

  const bestDay = tradingDaysList.reduce(
    (best, d) => (d.pnl > best.pnl ? d : best),
    tradingDaysList[0] ?? null,
  );
  const worstDay = tradingDaysList.reduce(
    (worst, d) => (d.pnl < worst.pnl ? d : worst),
    tradingDaysList[0] ?? null,
  );

  const maxAbsPnl = useMemo(
    () => Math.max(...tradingDaysList.map((d) => Math.abs(d.pnl)), 1),
    [tradingDaysList],
  );

  const weeklySummaries = useMemo(() => {
    const weeks: Array<{ weekNum: number; pnl: number; tradeCount: number; tradingDays: number }> = [];
    let currentWeek: CalendarDay[] = [];
    let weekNum = 1;

    days.forEach((day, i) => {
      currentWeek.push(day);
      if ((i + 1) % 7 === 0 || i === days.length - 1) {
        const weekDays = currentWeek.filter((d) => d.isCurrentMonth);
        const weekTradingDays = weekDays.filter((d) => d.trades > 0);
        weeks.push({
          weekNum,
          pnl: weekTradingDays.reduce((s, d) => s + d.pnl, 0),
          tradeCount: weekTradingDays.reduce((s, d) => s + d.trades, 0),
          tradingDays: weekTradingDays.length,
        });
        currentWeek = [];
        weekNum++;
      }
    });
    return weeks.filter((w) => w.tradingDays > 0 || w.tradeCount > 0 || true).slice(0, 6);
  }, [days]);

  // Selected day resolution
  const selectedParts = selectedKey ? selectedKey.split('-').map(Number) : null;
  const selectedYear = selectedParts ? selectedParts[0] : null;
  const selectedMonth = selectedParts ? selectedParts[1] : null;
  const selectedDayNum = selectedParts ? selectedParts[2] : null;

  const selectedTrades = selectedDayNum != null && selectedMonth != null && selectedYear != null
    ? trades.filter((t) => {
        const d = new Date(t.date);
        return d.getDate() === selectedDayNum && d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      })
    : [];

  const selectedDayPnl = selectedTrades.reduce((s, t) => s + t.pnl, 0);
  const selectedDayR = selectedTrades.reduce((s, t) => s + t.rMultiple, 0);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;
    const key = `${viewYear}-${viewMonth}-${day.day}`;
    if (day.trades > 0) {
      setSelectedKey(selectedKey === key ? null : key);
    } else {
      navigate('trade-create');
    }
  };

  const isSameViewAsToday = today.year === viewYear && today.month === viewMonth;
  const isSelectedInView = selectedYear === viewYear && selectedMonth === viewMonth;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-h1 text-text-primary">Calendar</h1>
        <p className="text-sm text-text-secondary mt-1.5">Your trading days, visualized.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* ==================== CALENDAR + SELECTED DAY ==================== */}
        <div className="space-y-6">
          <Card variant="elevated" className="p-5 sm:p-6 animate-fade-up">
            {/* Calendar header — V1: icon + "PnL Calendar" left, month nav right */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-5 h-5 text-accent" />
                <h3 className="text-h3 text-text-primary">PnL Calendar</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrevMonth}
                  className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-interactive vault-quiet-hover focus-ring"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-text-primary min-w-[130px] text-center tabular-nums">
                  {monthNames[viewMonth]} {viewYear}
                </span>
                <button
                  onClick={goNextMonth}
                  className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-interactive vault-quiet-hover focus-ring"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {weekdays.map((d) => (
                <div key={d} className="text-center text-[0.6875rem] text-text-tertiary font-medium uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid — 7 equal columns, square cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day, i) => (
                <CalendarDayCell
                  key={`${day.date}-${i}`}
                  day={day}
                  dayAgg={dayAggMap[day.day]}
                  selected={isSelectedInView && selectedDayNum === day.day && day.isCurrentMonth}
                  isToday={isSameViewAsToday && day.isCurrentMonth && day.day === today.day}
                  maxAbsPnl={maxAbsPnl}
                  viewMonth={viewMonth}
                  viewYear={viewYear}
                  onClick={() => handleDayClick(day)}
                />
              ))}
            </div>

            {/* Compact legend */}
            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
              <LegendItem label="Profit day" className="bg-positive/60" />
              <LegendItem label="Loss day" className="bg-negative/60" />
              <LegendItem label="Click empty day to add trade" className="bg-surface-interactive border border-border" />
            </div>
          </Card>

          {/* Selected day trades */}
          {selectedKey && isSelectedInView && selectedDayNum != null && (
            <Card className="p-5 sm:p-6 animate-fade-up overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <SectionLabel>{monthNames[viewMonth]} {selectedDayNum}, {viewYear}</SectionLabel>
                  <div className="flex items-baseline gap-3 mt-1.5">
                    <h3 className="text-h3 text-text-primary">
                      {selectedTrades.length > 0
                        ? `${selectedTrades.length} ${selectedTrades.length === 1 ? 'trade' : 'trades'}`
                        : 'No trades'}
                    </h3>
                    {selectedTrades.length > 0 && (
                      <span className={cn(
                        'text-sm font-semibold',
                        selectedDayPnl >= 0 ? 'text-positive' : 'text-negative',
                      )}>
                        {selectedDayPnl >= 0 ? '+' : ''}{formatCurrency(selectedDayPnl)} · {formatR(selectedDayR)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => navigate('trade-create')}>
                    <Plus className="w-3.5 h-3.5" />
                    Add Trade
                  </Button>
                  <button
                    onClick={() => setSelectedKey(null)}
                    className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-interactive vault-quiet-hover focus-ring"
                    title="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedTrades.length > 0 ? (
                <div className="space-y-1">
                  {selectedTrades.map((trade) => {
                    const isWin = trade.outcome === 'win';
                    const isLoss = trade.outcome === 'loss';
                    return (
                      <button
                        key={trade.id}
                        onClick={() => navigate('trade-detail', { id: trade.id })}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-surface-interactive vault-quiet-hover text-left focus-ring"
                      >
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-xs',
                          isWin ? 'bg-positive/10 text-positive' : isLoss ? 'bg-negative/10 text-negative' : 'bg-surface-interactive text-text-secondary',
                        )}>
                          {trade.symbol.slice(0, 3)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-text-primary">{trade.symbol}</span>
                            <DirectionBadge direction={trade.direction} />
                          </div>
                          <div className="text-xs text-text-tertiary mt-0.5">{trade.strategy} · {trade.session}</div>
                        </div>
                        <span className={cn(
                          'text-sm font-semibold hidden sm:block',
                          isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary',
                        )}>
                          {formatR(trade.rMultiple)}
                        </span>
                        <span className={cn(
                          'text-sm font-medium w-20 text-right',
                          isWin ? 'text-positive' : isLoss ? 'text-negative' : 'text-text-secondary',
                        )}>
                          {formatCurrency(trade.pnl)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="Quiet day."
                  description="Sometimes the best trade is no trade."
                  className="py-8"
                />
              )}
            </Card>
          )}
        </div>

        {/* ==================== RIGHT SIDEBAR ==================== */}
        <div className="space-y-6">
          {/* Monthly Summary */}
          <Card variant="elevated" className="p-5 animate-fade-up">
            <SectionLabel>Monthly Summary</SectionLabel>
            <div className="text-xs text-text-tertiary mt-1">{monthNames[viewMonth]} {viewYear}</div>

            {/* Net P&L — performance-colored container */}
            <div className={cn(
              'mt-4 p-4 rounded-lg border',
              monthPnl >= 0
                ? 'bg-positive/5 border-positive/20'
                : 'bg-negative/5 border-negative/20',
            )}>
              <div className="text-[0.6875rem] text-text-tertiary uppercase tracking-wider font-medium">Net P&L</div>
              <div className={cn(
                'text-2xl font-semibold mt-1 tabular-nums',
                monthPnl >= 0 ? 'text-positive' : 'text-negative',
              )}>
                {monthPnl >= 0 ? '+' : ''}{formatCurrency(monthPnl)}
              </div>
            </div>

            {/* Win Rate / Trades per Days */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-lg bg-surface-interactive/50 border border-border-subtle">
                <div className="text-[0.6875rem] text-text-tertiary uppercase tracking-wider font-medium">Win Rate</div>
                <div className="text-lg font-semibold text-text-primary mt-1 tabular-nums">{monthWinRate.toFixed(0)}%</div>
                <div className="text-[0.6875rem] text-text-tertiary mt-0.5">{monthWins}W · {monthTrades.length - monthWins}L</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-interactive/50 border border-border-subtle">
                <div className="text-[0.6875rem] text-text-tertiary uppercase tracking-wider font-medium">Trades / Days</div>
                <div className="text-lg font-semibold text-text-primary mt-1 tabular-nums">{monthTrades.length} / {tradingDaysCount}</div>
                <div className="text-[0.6875rem] text-text-tertiary mt-0.5">{tradingDaysCount} active days</div>
              </div>
            </div>

            {/* Best Day / Worst Day */}
            <div className="space-y-2 mt-3">
              {bestDay && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-positive/5 border border-positive/15">
                  <div>
                    <div className="text-[0.6875rem] text-text-tertiary uppercase tracking-wider font-medium">Best Day</div>
                    <div className="text-sm font-medium text-text-primary mt-0.5">{monthNames[viewMonth].slice(0, 3)} {bestDay.day}</div>
                  </div>
                  <div className="text-sm font-semibold text-positive tabular-nums">+{formatCurrency(bestDay.pnl)}</div>
                </div>
              )}
              {worstDay && worstDay.pnl < 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-negative/5 border border-negative/15">
                  <div>
                    <div className="text-[0.6875rem] text-text-tertiary uppercase tracking-wider font-medium">Worst Day</div>
                    <div className="text-sm font-medium text-text-primary mt-0.5">{monthNames[viewMonth].slice(0, 3)} {worstDay.day}</div>
                  </div>
                  <div className="text-sm font-semibold text-negative tabular-nums">{formatCurrency(worstDay.pnl)}</div>
                </div>
              )}
              {tradingDaysList.length === 0 && (
                <div className="p-3 rounded-lg bg-surface-interactive/50 border border-border-subtle text-center">
                  <div className="text-sm text-text-tertiary">No trading data this month</div>
                </div>
              )}
            </div>
          </Card>

          {/* Weekly Summary */}
          <Card variant="elevated" className="p-5 animate-fade-up animate-delay-100">
            <SectionLabel>Weekly Summary</SectionLabel>
            <div className="space-y-2 mt-3">
              {weeklySummaries.map((week) => {
                const isPositive = week.pnl >= 0;
                const hasData = week.tradingDays > 0;
                return (
                  <div
                    key={week.weekNum}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      hasData
                        ? isPositive
                          ? 'bg-positive/5 border-positive/15'
                          : 'bg-negative/5 border-negative/15'
                        : 'bg-surface-interactive/50 border-border-subtle',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[0.6875rem] text-text-tertiary uppercase tracking-wider font-medium">W{week.weekNum}</span>
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {week.tradingDays} {week.tradingDays === 1 ? 'day' : 'days'}
                        </div>
                        <div className="text-[0.6875rem] text-text-tertiary">{week.tradeCount} trades</div>
                      </div>
                    </div>
                    <div className={cn(
                      'text-sm font-semibold tabular-nums',
                      hasData
                        ? isPositive ? 'text-positive' : 'text-negative'
                        : 'text-text-tertiary',
                    )}>
                      {hasData ? (isPositive ? '+' : '') + formatCurrency(week.pnl) : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Daily Debrief CTA */}
          <Card className="p-5 animate-fade-up animate-delay-200">
            <SectionLabel>Daily Debrief</SectionLabel>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">Reflect on today's session and seal it.</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('debrief')}>
              Start Debrief
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ==================== CALENDAR TOOLTIP — V1-style: elevated, arrow, above cell ====================
function CalendarTooltip({
  hasTrades,
  dateLabel,
  pnl,
  isPositive,
  isNegative,
  tradeCount,
  winRate,
  children,
}: {
  hasTrades: boolean;
  dateLabel: string;
  pnl: number;
  isPositive: boolean;
  isNegative: boolean;
  tradeCount: number;
  winRate: number;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setVisible(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [visible]);

  return (
    <div ref={ref} className="relative w-full" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none animate-fade-in">
          <div className="px-3 py-2 rounded-lg vault-elevated shadow-elevated dark:shadow-dark-elevated border border-border-strong min-w-[140px]">
            {hasTrades ? (
              <div className="text-center">
                <div className="text-text-tertiary text-[0.6875rem] mb-1.5">{dateLabel}</div>
                <div className={cn('text-sm font-semibold mb-1 tabular-nums', isPositive ? 'text-positive' : isNegative ? 'text-negative' : 'text-text-secondary')}>
                  {isPositive ? '+' : ''}{formatCurrency(pnl)}
                </div>
                <div className="flex items-center justify-center gap-2 text-text-tertiary text-xs">
                  <span>{tradeCount} {tradeCount === 1 ? 'trade' : 'trades'}</span>
                  <span className="text-text-tertiary/40">·</span>
                  <span>{winRate.toFixed(0)}% win rate</span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-text-tertiary text-[0.6875rem] mb-0.5">{dateLabel}</div>
                <div className="text-text-tertiary text-xs">No trades · Click to add</div>
              </div>
            )}
          </div>
          {/* Pointer arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-surface-elevated border-r border-b border-border-strong" />
        </div>
      )}
    </div>
  );
}

// ==================== DAY CELL ====================
function CalendarDayCell({
  day,
  dayAgg,
  selected,
  isToday,
  maxAbsPnl,
  viewMonth,
  viewYear,
  onClick,
}: {
  day: CalendarDay;
  dayAgg?: DayAgg;
  selected: boolean;
  isToday: boolean;
  maxAbsPnl: number;
  viewMonth: number;
  viewYear: number;
  onClick: () => void;
}) {
  if (!day.isCurrentMonth) {
    return <div className="w-full aspect-square rounded-lg" />;
  }

  const hasTrades = day.trades > 0;
  const isPositive = day.pnl > 0;
  const isNegative = day.pnl < 0;
  const intensity = hasTrades
    ? Math.min(Math.abs(day.pnl) / Math.max(maxAbsPnl, 1), 1)
    : 0;

  const cellStyle: React.CSSProperties | undefined = hasTrades
    ? {
        backgroundColor: isPositive
          ? `rgb(var(--positive) / ${0.07 + intensity * 0.28})`
          : isNegative
            ? `rgb(var(--negative) / ${0.07 + intensity * 0.28})`
            : 'transparent',
        borderColor: isPositive
          ? `rgb(var(--positive) / ${0.25 + intensity * 0.5})`
          : isNegative
            ? `rgb(var(--negative) / ${0.25 + intensity * 0.5})`
            : 'rgb(var(--border))',
      }
    : undefined;

  const hoverGlowClass = hasTrades
    ? isPositive
      ? 'hover:shadow-[0_0_14px_-2px_rgb(var(--positive-glow)/0.5)] hover:border-positive/70'
      : isNegative
        ? 'hover:shadow-[0_0_14px_-2px_rgb(var(--negative-glow)/0.5)] hover:border-negative/70'
        : 'hover:border-border-strong'
    : 'hover:border-border-strong hover:bg-surface-interactive/40';

  const winRate = dayAgg && dayAgg.trades > 0 ? (dayAgg.wins / dayAgg.trades) * 100 : 0;

  const cellClass = cn(
    'relative w-full aspect-square min-w-0 box-border rounded-lg border flex flex-col items-center justify-center p-1.5 overflow-hidden transition-all duration-micro cursor-pointer hover:scale-[1.04] focus-ring',
    !hasTrades && 'bg-transparent border-border',
    hoverGlowClass,
    selected && 'ring-2 ring-accent ring-offset-1 ring-offset-bg z-10',
  );

  return (
    <CalendarTooltip
      hasTrades={hasTrades}
      dateLabel={`${monthNames[viewMonth].slice(0, 3)} ${day.day}, ${viewYear}`}
      pnl={day.pnl}
      isPositive={isPositive}
      isNegative={isNegative}
      tradeCount={day.trades}
      winRate={winRate}
    >
      <button
        type="button"
        onClick={onClick}
        className={cellClass}
        style={cellStyle}
        aria-label={
          hasTrades
            ? `${monthNames[viewMonth]} ${day.day}, ${viewYear}: ${formatCurrency(day.pnl)}`
            : `${monthNames[viewMonth]} ${day.day}, ${viewYear}: no trades`
        }
      >
        {isToday && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        )}

        <span className={cn(
          'absolute top-1.5 left-1.5 text-[0.625rem] font-medium leading-none tabular-nums',
          hasTrades ? 'text-text-primary' : 'text-text-tertiary',
        )}>
          {day.day}
        </span>

        {hasTrades ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center w-full min-h-0">
            <span className={cn(
              'max-w-full truncate text-[0.6875rem] font-semibold leading-tight tabular-nums',
              isPositive ? 'text-positive' : isNegative ? 'text-negative' : 'text-text-secondary',
            )}>
              {isPositive ? '+' : ''}{formatCurrency(day.pnl, true)}
            </span>
            <span className="mt-1 text-[0.5625rem] leading-none text-text-tertiary tabular-nums">
              {day.trades}T
            </span>
          </div>
        ) : (
          <span className="flex-1" aria-hidden="true" />
        )}
      </button>
    </CalendarTooltip>
  );
}

function LegendItem({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn('w-3 h-3 rounded-sm border border-border', className)} />
      <span className="text-xs text-text-tertiary">{label}</span>
    </div>
  );
}
