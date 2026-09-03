import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DirectionBadge, Badge } from '@/components/ui/Badge';
import { showToast } from '@/components/ui/Toast';
import { useNav } from '@/navigation/NavProvider';
import { cn } from '@/lib/utils';
import type { Direction, Session } from '@/types';

const steps = ['Setup', 'Execution', 'Analysis', 'Reflection', 'Review'];

const symbolOptions = [
  { value: 'XAUUSD', label: 'XAUUSD' },
  { value: 'EURUSD', label: 'EURUSD' },
  { value: 'GBPJPY', label: 'GBPJPY' },
  { value: 'USDJPY', label: 'USDJPY' },
  { value: 'US30', label: 'US30' },
  { value: 'NAS100', label: 'NAS100' },
  { value: 'BTCUSD', label: 'BTCUSD' },
  { value: 'AUDUSD', label: 'AUDUSD' },
];

const sessionOptions: { value: Session; label: string }[] = [
  { value: 'London', label: 'London' },
  { value: 'New York', label: 'New York' },
  { value: 'Tokyo', label: 'Tokyo' },
  { value: 'London/NY Overlap', label: 'London/NY Overlap' },
];

const strategyOptions = [
  { value: 'London Sweep', label: 'London Sweep' },
  { value: 'NY Open Drive', label: 'NY Open Drive' },
  { value: 'Liquidity Grab', label: 'Liquidity Grab' },
  { value: 'Breakout Retest', label: 'Breakout Retest' },
  { value: 'Trend Pullback', label: 'Trend Pullback' },
  { value: 'Range Reversal', label: 'Range Reversal' },
];

interface FormData {
  symbol: string;
  direction: Direction;
  session: Session;
  strategy: string;
  entry: string;
  exit: string;
  stopLoss: string;
  takeProfit: string;
  positionSize: string;
  risk: string;
  reasoning: string;
  psychology: string;
  whatWentRight: string;
  whatWentWrong: string;
  lesson: string;
  tags: string[];
}

export function TradeCreatePage() {
  const { navigate } = useNav();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<Direction>('LONG');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    symbol: 'XAUUSD',
    direction: 'LONG',
    session: 'London',
    strategy: 'London Sweep',
    entry: '',
    exit: '',
    stopLoss: '',
    takeProfit: '',
    positionSize: '',
    risk: '',
    reasoning: '',
    psychology: '',
    whatWentRight: '',
    whatWentWrong: '',
    lesson: '',
    tags: [],
  });

  const update = (field: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('success', 'Trade added to your vault.');
      navigate('trades');
    }, 1200);
  };

  const canProceed = () => {
    if (step === 0) return form.symbol && form.strategy;
    if (step === 1) return form.entry && form.stopLoss;
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <h1 className="text-h1 text-text-primary">New Trade Entry</h1>
        <p className="text-sm text-text-secondary mt-1.5">Document every detail of your decision.</p>
      </div>

      {/* Progress indicator */}
      <div className="animate-fade-up">
        <div className="flex items-center justify-between">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-standard ease-premium',
                    i < step && 'bg-accent text-bg',
                    i === step && 'bg-accent/15 text-accent border-2 border-accent',
                    i > step && 'bg-surface-interactive text-text-tertiary border border-border',
                  )}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn(
                  'text-[0.6875rem] font-medium uppercase tracking-wider transition-colors duration-standard hidden sm:block',
                  i <= step ? 'text-text-primary' : 'text-text-tertiary'
                )}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 rounded-full bg-border overflow-hidden">
                  <div
                    className={cn('h-full bg-accent transition-all duration-structural ease-premium', i < step ? 'w-full' : 'w-0')}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <Card variant="elevated" className="p-6 sm:p-8 min-h-[320px] animate-fade-in" key={step}>
        {step === 0 && (
          <div className="space-y-5 animate-slide-right">
            <div>
              <SectionLabel>Instrument & Direction</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Select
                  value={form.symbol}
                  options={symbolOptions}
                  onChange={(v) => update('symbol', v)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setDirection('LONG'); update('direction', 'LONG'); }}
                    className={cn(
                      'flex-1 h-10 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-all duration-micro focus-ring',
                      direction === 'LONG'
                        ? 'bg-positive/10 text-positive border-positive/30'
                        : 'vault-surface text-text-secondary border-border hover:border-border-strong',
                    )}
                  >
                    ▲ Long
                  </button>
                  <button
                    onClick={() => { setDirection('SHORT'); update('direction', 'SHORT'); }}
                    className={cn(
                      'flex-1 h-10 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-all duration-micro focus-ring',
                      direction === 'SHORT'
                        ? 'bg-negative/10 text-negative border-negative/30'
                        : 'vault-surface text-text-secondary border-border hover:border-border-strong',
                    )}
                  >
                    ▼ Short
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">Session</label>
                <Select value={form.session} options={sessionOptions} onChange={(v) => update('session', v as Session)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">Strategy</label>
                <Select value={form.strategy} options={strategyOptions} onChange={(v) => update('strategy', v)} />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-slide-right">
            <div>
              <SectionLabel>Price Levels</SectionLabel>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input label="Entry Price" placeholder="0.00" value={form.entry} onChange={(e) => update('entry', e.target.value)} />
                <Input label="Exit Price" placeholder="0.00" value={form.exit} onChange={(e) => update('exit', e.target.value)} />
                <Input label="Stop Loss" placeholder="0.00" value={form.stopLoss} onChange={(e) => update('stopLoss', e.target.value)} />
                <Input label="Take Profit" placeholder="0.00" value={form.takeProfit} onChange={(e) => update('takeProfit', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Position Size" placeholder="0.00 lots" value={form.positionSize} onChange={(e) => update('positionSize', e.target.value)} />
              <Input label="Risk ($)" placeholder="0.00" value={form.risk} onChange={(e) => update('risk', e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-slide-right">
            <Textarea
              label="Why was the trade taken?"
              placeholder="Describe the setup, market context, and your reasoning for entering this trade..."
              rows={5}
              value={form.reasoning}
              onChange={(e) => update('reasoning', e.target.value)}
            />
            <Textarea
              label="How did you feel?"
              placeholder="Describe your emotional state before, during, and after the trade..."
              rows={4}
              value={form.psychology}
              onChange={(e) => update('psychology', e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-slide-right">
            <Textarea
              label="What went right?"
              placeholder="What did you do well in this trade?"
              rows={3}
              value={form.whatWentRight}
              onChange={(e) => update('whatWentRight', e.target.value)}
            />
            <Textarea
              label="What went wrong?"
              placeholder="What could have been done better?"
              rows={3}
              value={form.whatWentWrong}
              onChange={(e) => update('whatWentWrong', e.target.value)}
            />
            <Textarea
              label="What was learned?"
              placeholder="The key takeaway from this trade..."
              rows={3}
              value={form.lesson}
              onChange={(e) => update('lesson', e.target.value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-slide-right">
            <SectionLabel>Review & Save</SectionLabel>
            <div className="space-y-3">
              <ReviewRow label="Symbol" value={form.symbol} />
              <ReviewRow label="Direction" value={<DirectionBadge direction={direction} />} />
              <ReviewRow label="Session" value={form.session} />
              <ReviewRow label="Strategy" value={form.strategy} />
              <ReviewRow label="Entry" value={form.entry || '—'} />
              <ReviewRow label="Stop Loss" value={form.stopLoss || '—'} />
              <ReviewRow label="Risk" value={form.risk ? `$${form.risk}` : '—'} />
              {form.reasoning && <ReviewRow label="Analysis" value={form.reasoning.slice(0, 60) + (form.reasoning.length > 60 ? '...' : '')} />}
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between animate-fade-in">
        <Button variant="ghost" onClick={back} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('trades')}>
            <X className="w-4 h-4" />
            Cancel
          </Button>
          {step < steps.length - 1 ? (
            <Button variant="primary" onClick={next} disabled={!canProceed()}>
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="primary" onClick={save} loading={saving}>
              {!saving && <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Trade'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-text-tertiary uppercase tracking-wider font-medium">{label}</span>
      <span className="text-sm text-text-primary font-medium">{value}</span>
    </div>
  );
}
