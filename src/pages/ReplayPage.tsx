import { ArrowLeft, ArrowRight, Circle, CheckCircle2, XCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { replayEvents, formatR } from '@/data/mockData';
import { useNav } from '@/navigation/NavProvider';
import { cn } from '@/lib/utils';
import type { ReplayEvent } from '@/types';

export function ReplayPage() {
  const { navigate } = useNav();
  const totalR = replayEvents.filter((e) => e.rMultiple).reduce((sum, e) => sum + (e.rMultiple ?? 0), 0);
  const trades = replayEvents.filter((e) => e.type === 'open').length;
  const violations = 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('calendar')}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-micro focus-ring rounded-md animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Calendar
      </button>

      {/* Header */}
      <div className="text-center animate-fade-up">
        <h1 className="text-h1 text-text-primary">Session Replay</h1>
        <p className="text-sm text-text-secondary mt-1.5">
          {new Date(2026, 7, 27).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Timeline */}
      <Card variant="elevated" className="p-6 sm:p-8 animate-fade-up">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-6">
            {replayEvents.map((event, i) => (
              <ReplayEventRow key={i} event={event} index={i} />
            ))}
          </div>
        </div>

        {/* Session complete */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-center">
            <SectionLabel>Session Complete</SectionLabel>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className={cn('text-h2 font-semibold', totalR >= 0 ? 'text-positive' : 'text-negative')}>
                  {formatR(totalR)}
                </div>
                <div className="text-xs text-text-tertiary mt-1">Total R</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-h2 font-semibold text-text-primary">{trades}</div>
                <div className="text-xs text-text-tertiary mt-1">Trades</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-h2 font-semibold text-warning">{violations}</div>
                <div className="text-xs text-text-tertiary mt-1">Violations</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Next steps */}
      <div className="flex justify-center gap-3 animate-fade-up animate-delay-300">
        <Button variant="secondary" onClick={() => navigate('calendar')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Calendar
        </Button>
        <Button variant="primary" onClick={() => navigate('debrief')}>
          Daily Debrief
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ReplayEventRow({ event, index }: { event: ReplayEvent; index: number }) {
  const Icon = event.type === 'open' ? Circle : event.type === 'close' ? (event.rMultiple && event.rMultiple >= 0 ? CheckCircle2 : XCircle) : event.type === 'partial' ? TrendingUp : AlertCircle;
  const tone =
    event.type === 'open' ? 'text-text-tertiary' :
    event.type === 'close' ? (event.rMultiple && event.rMultiple >= 0 ? 'text-positive' : 'text-negative') :
    event.type === 'partial' ? 'text-accent' : 'text-warning';

  return (
    <div
      className="relative pl-10 animate-fade-up"
      style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
    >
      {/* Node */}
      <div className={cn('absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center bg-bg border border-border', tone)}>
        <Icon className="w-3 h-3" />
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-tertiary tabular-nums">{event.time}</span>
          <span className="text-sm font-medium text-text-primary">{event.label}</span>
          {event.rMultiple !== undefined && (
            <span className={cn(
              'text-sm font-semibold',
              event.rMultiple >= 0 ? 'text-positive' : 'text-negative'
            )}>
              {formatR(event.rMultiple)}
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-1">{event.detail}</p>
      </div>
    </div>
  );
}
