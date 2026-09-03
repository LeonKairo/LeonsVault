import { useState } from 'react';
import { Lock, Check } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { showToast } from '@/components/ui/Toast';
import { trades, formatCurrency, formatR } from '@/data/mockData';
import { cn } from '@/lib/utils';

type DayRating = 'Good' | 'Perfect' | 'Bad' | 'Ugly';
type PlanAdherence = 'Yes' | 'Mostly' | 'No';

const dayRatings: { value: DayRating; tone: string }[] = [
  { value: 'Good', tone: 'hover:border-positive/40 hover:bg-positive/5' },
  { value: 'Perfect', tone: 'hover:border-accent/40 hover:bg-accent/5' },
  { value: 'Bad', tone: 'hover:border-warning/40 hover:bg-warning/5' },
  { value: 'Ugly', tone: 'hover:border-negative/40 hover:bg-negative/5' },
];

const planOptions: PlanAdherence[] = ['Yes', 'Mostly', 'No'];

const factors = ['Nothing', 'FOMO', 'Fear', 'Revenge', 'Overtrading', 'Hesitation', 'Other'];

export function DebriefPage() {
  const [dayRating, setDayRating] = useState<DayRating | null>(null);
  const [plan, setPlan] = useState<PlanAdherence | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [sealing, setSealing] = useState(false);
  const [sealed, setSealed] = useState(false);

  const todayTrades = trades.filter((t) => {
    const d = new Date(t.date);
    return d.toDateString() === new Date(2026, 7, 27).toDateString();
  });
  const todayPnl = todayTrades.reduce((sum, t) => sum + t.pnl, 0);
  const todayR = todayTrades.reduce((sum, t) => sum + t.rMultiple, 0);
  const disciplineScore = plan === 'Yes' ? 85 : plan === 'Mostly' ? 65 : plan === 'No' ? 30 : 0;

  const toggleFactor = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const seal = () => {
    setSealing(true);
    setTimeout(() => {
      setSealing(false);
      setSealed(true);
      showToast('success', 'Session sealed.');
    }, 1800);
  };

  if (sealed) {
    return (
      <div className="max-w-md mx-auto space-y-8 pt-8">
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-6 animate-seal-complete">
            <Lock className="w-7 h-7 text-accent" />
          </div>
          <h2 className="text-h1 text-text-primary mb-2">Session Sealed.</h2>
          <p className="text-sm text-text-secondary">
            {new Date(2026, 7, 27).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card variant="elevated" className="p-6 animate-fade-up">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <SectionLabel>P&L</SectionLabel>
              <div className={cn('text-h2 font-semibold mt-2', todayPnl >= 0 ? 'text-positive' : 'text-negative')}>
                {formatCurrency(todayPnl)}
              </div>
            </div>
            <div className="text-center">
              <SectionLabel>R Multiple</SectionLabel>
              <div className={cn('text-h2 font-semibold mt-2', todayR >= 0 ? 'text-positive' : 'text-negative')}>
                {formatR(todayR)}
              </div>
            </div>
            <div className="text-center">
              <SectionLabel>Trades</SectionLabel>
              <div className="text-h2 font-semibold text-text-primary mt-2">{todayTrades.length}</div>
            </div>
            <div className="text-center">
              <SectionLabel>Discipline</SectionLabel>
              <div className="text-h2 font-semibold text-accent mt-2">{disciplineScore}</div>
            </div>
          </div>
        </Card>

        <div className="text-center animate-fade-up animate-delay-300">
          <p className="text-sm text-text-tertiary italic">
            "The numbers don't judge you. They just remember."
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center animate-fade-in">
        <h1 className="text-h1 text-text-primary">Daily Debrief</h1>
        <p className="text-sm text-text-secondary mt-1.5">
          {new Date(2026, 7, 27).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Day rating */}
      <Card className="p-6 animate-fade-up">
        <SectionLabel>How was trading today?</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {dayRatings.map(({ value, tone }) => (
            <button
              key={value}
              onClick={() => setDayRating(value)}
              className={cn(
                'h-20 rounded-lg border transition-all duration-standard ease-premium focus-ring flex flex-col items-center justify-center gap-1',
                dayRating === value
                  ? 'border-accent bg-accent/10 text-accent'
                  : cn('vault-surface text-text-secondary border-border', tone),
              )}
            >
              <span className="text-sm font-semibold">{value}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Plan adherence */}
      <Card className="p-6 animate-fade-up animate-delay-100">
        <SectionLabel>Did you follow your plan?</SectionLabel>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {planOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setPlan(opt)}
              className={cn(
                'h-12 rounded-lg border transition-all duration-standard ease-premium focus-ring text-sm font-medium',
                plan === opt
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'vault-surface text-text-secondary border-border hover:border-border-strong',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </Card>

      {/* Factors */}
      <Card className="p-6 animate-fade-up animate-delay-200">
        <SectionLabel>What affected your trading?</SectionLabel>
        <div className="flex flex-wrap gap-2 mt-4">
          {factors.map((factor) => (
            <button
              key={factor}
              onClick={() => toggleFactor(factor)}
              className={cn(
                'h-9 px-4 rounded-lg border text-sm font-medium transition-all duration-micro focus-ring',
                selectedFactors.includes(factor)
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'vault-surface text-text-secondary border-border hover:border-border-strong',
              )}
            >
              {factor}
            </button>
          ))}
        </div>
      </Card>

      {/* Reflection */}
      <Card className="p-6 animate-fade-up animate-delay-300">
        <SectionLabel>One thought from today.</SectionLabel>
        <Textarea
          placeholder="What do you want to remember about this session?"
          rows={4}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="mt-4"
        />
      </Card>

      {/* Seal */}
      <div className="flex justify-center animate-fade-up animate-delay-400">
        <Button
          variant="gold"
          size="lg"
          onClick={seal}
          loading={sealing}
          disabled={!dayRating || !plan}
          className="min-w-[200px]"
        >
          {sealing ? (
            'Sealing...'
          ) : sealed ? (
            <>
              <Check className="w-4 h-4" />
              Sealed
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Seal Session
            </>
          )}
        </Button>
      </div>

      {!dayRating || !plan ? (
        <p className="text-center text-xs text-text-tertiary">
          Rate your day and plan adherence to seal the session.
        </p>
      ) : null}
    </div>
  );
}
