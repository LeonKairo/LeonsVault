import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { trades, formatCurrency, formatR } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { CalendarDay } from '@/types';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();

  const tradeDaysMap: Record<number, { pnl: number; r: number; trades: number }> = {};
  for (const t of trades) {
    const d = new Date(t.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!tradeDaysMap[day]) tradeDaysMap[day] = { pnl: 0, r: 0, trades: 0 };
      tradeDaysMap[day].pnl += t.pnl;
      tradeDaysMap[day].r += t.rMultiple;
      tradeDaysMap[day].trades += 1;
    }
  }

  const days: CalendarDay[] = [];

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
    const dayData = tradeDaysMap[d];
    let status: CalendarDay['status'] = 'no-trade';
    if (dayData) {
      if (dayData.pnl > 0) status = 'positive';
      else if (dayData.pnl < 0) status = 'negative';
      else status = 'neutral';
    }
    days.push({
      date: date.toISOString(),
      day: d,
      status,
      pnl: dayData?.pnl ?? 0,
      rMultiple: dayData?.r ?? 0,
      trades: dayData?.trades ?? 0,
      isCurrentMonth: true,
    });
  }

  return days;
}

export function CalendarPreview() {
  const [month, setMonth] = useState(7);
  const [year, setYear] = useState(2026);

  const days = useMemo(() => buildCalendarDays(year, month), [year, month]);
  const monthLabel = `${monthNames[month]} ${year}`;

  const maxAbsPnl = useMemo(
    () => Math.max(...days.filter((d) => d.isCurrentMonth && d.trades > 0).map((d) => Math.abs(d.pnl)), 1),
    [days],
  );

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <Card className="p-6 animate-fade-up animate-delay-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <SectionLabel>Performance Calendar</SectionLabel>
          <h3 className="text-h3 text-text-primary mt-1.5">{monthLabel}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-interactive transition-colors duration-micro focus-ring"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goNext}
            className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-interactive transition-colors duration-micro focus-ring"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {weekdays.map((d) => (
          <div key={d} className="text-center text-[0.6875rem] text-text-tertiary font-medium uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => (
          <DayCell key={`${day.date}-${i}`} day={day} maxAbsPnl={maxAbsPnl} viewMonth={month} viewYear={year} />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
        <LegendItem label="Profit" className="bg-positive/60" />
        <LegendItem label="Loss" className="bg-negative/60" />
        <LegendItem label="No trade" className="bg-surface-interactive border border-border" />
      </div>
    </Card>
  );
}

function DayCell({
  day,
  maxAbsPnl,
  viewMonth,
  viewYear,
}: {
  day: CalendarDay;
  maxAbsPnl: number;
  viewMonth: number;
  viewYear: number;
}) {
  if (!day.isCurrentMonth) {
    return <div className="w-full aspect-square rounded-lg" />;
  }

  const hasTrades = day.trades > 0;
  const isPositive = day.pnl > 0;
  const isNegative = day.pnl < 0;
  const intensity = hasTrades ? Math.min(Math.abs(day.pnl) / Math.max(maxAbsPnl, 1), 1) : 0;

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

  return (
    <Tooltip
      content={
        hasTrades ? (
          <div className="text-center">
            <div className="text-text-tertiary text-[0.6875rem] mb-0.5">
              {monthNames[viewMonth].slice(0, 3)} {day.day}, {viewYear}
            </div>
            <div className={cn('text-sm font-semibold mb-0.5', isPositive ? 'text-positive' : isNegative ? 'text-negative' : 'text-text-secondary')}>
              {isPositive ? '+' : ''}{formatCurrency(day.pnl)}
            </div>
            <div className="text-text-tertiary text-[0.6875rem]">{formatR(day.rMultiple)}</div>
            <div className="text-text-tertiary text-[0.6875rem] mt-0.5">
              {day.trades} {day.trades === 1 ? 'trade' : 'trades'}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-text-tertiary text-[0.6875rem] mb-0.5">
              {monthNames[viewMonth].slice(0, 3)} {day.day}, {viewYear}
            </div>
            <div className="text-text-tertiary text-xs">No trades</div>
          </div>
        )
      }
    >
      <div
        className={cn(
          'relative w-full aspect-square min-w-0 box-border rounded-lg border flex flex-col p-1.5 overflow-hidden',
          'transition-[border-color,background-color,box-shadow] duration-micro',
          !hasTrades && 'bg-transparent border-border',
          hoverGlowClass,
        )}
        style={cellStyle}
      >
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
      </div>
    </Tooltip>
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
