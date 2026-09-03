import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { useSessionCheckIn } from '@/session/SessionCheckInProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import type { CheckInCause, CheckInFeeling } from '@/types';

type Phase = 'init' | 'welcome' | 'feeling' | 'cause' | 'response';

const feelings: { value: CheckInFeeling; label: string }[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'off', label: 'Off' },
  { value: 'stressed', label: 'Stressed' },
  { value: 'exhausted', label: 'Exhausted' },
];

const causes: { value: CheckInCause; label: string }[] = [
  { value: 'physical', label: 'Physical' },
  { value: 'personal_stress', label: 'Personal stress' },
  { value: 'post_loss', label: 'Post-loss' },
  { value: 'fomo', label: 'Restless / FOMO' },
  { value: 'other', label: 'Other' },
];

export function SessionCheckIn({ onComplete }: { onComplete: () => void }) {
  const { submitCheckIn, acknowledge, checkIn, status } = useSessionCheckIn();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [phase, setPhase] = useState<Phase>('init');
  const [feeling, setFeeling] = useState<CheckInFeeling | null>(null);
  const [cause, setCause] = useState<CheckInCause | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Cinematic init sequence — runs once on mount, both timers set together
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('welcome'), 1400);
    const t2 = setTimeout(() => setPhase('feeling'), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFeelingSelect = (f: CheckInFeeling) => {
    setFeeling(f);
    if (f === 'calm') {
      setSubmitting(true);
      submitCheckIn(f).then(() => {
        setSubmitting(false);
        setPhase('response');
      });
    } else {
      setPhase('cause');
    }
  };

  const handleCauseSelect = (c: CheckInCause) => {
    setCause(c);
    setSubmitting(true);
    submitCheckIn(feeling!, c).then(() => {
      setSubmitting(false);
      setPhase('response');
    });
  };

  const handleAcknowledge = async () => {
    await acknowledge();
    setAcknowledged(true);
    onComplete();
  };

  // If already cleared from a calm check-in or acknowledged soft warning
  const isCleared = status === 'cleared' && phase === 'response' && feeling === 'calm';
  const isSoftWarning = status === 'soft_warning' && !acknowledged && phase === 'response';
  const isBlocked = (status === 'hard_block' || status === 'cooldown') && phase === 'response';

  const formatBlockTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      'bg-bg',
      isDark ? 'bg-opacity-98' : 'bg-opacity-98',
    )}>
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgb(var(--accent) / ${isDark ? 0.04 : 0.02}) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* INIT PHASE */}
        {phase === 'init' && (
          <div className="text-center animate-fade-in">
            <div className="mb-6 flex justify-center">
              <div className="w-12 h-12 rounded-xl border border-border-luminous/40 flex items-center justify-center vault-edge-luminous">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="text-[0.6875rem] uppercase tracking-[0.2em] text-text-tertiary font-medium animate-fade-up">
              Leon's Vault
            </div>
            <div className="mt-4 text-sm text-text-secondary tracking-wider animate-fade-up animate-delay-200">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                System Initializing
              </span>
            </div>
          </div>
        )}

        {/* WELCOME PHASE */}
        {phase === 'welcome' && (
          <div className="text-center animate-fade-in">
            <div className="mb-6 flex justify-center">
              <div className="w-12 h-12 rounded-xl border border-border-luminous/40 flex items-center justify-center vault-edge-luminous">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
            </div>
            <h1 className="text-h1 text-text-primary font-semibold animate-fade-up">
              Welcome back, Leon.
            </h1>
          </div>
        )}

        {/* FEELING PHASE */}
        {phase === 'feeling' && (
          <div className="animate-fade-in">
            <div className="mb-6 text-center">
              <div className="text-[0.6875rem] uppercase tracking-[0.15em] text-text-tertiary font-medium mb-2">
                Session Check-In
              </div>
              <h2 className="text-h2 text-text-primary font-semibold">
                How are you feeling right now?
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {feelings.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleFeelingSelect(f.value)}
                  disabled={submitting}
                  className={cn(
                    'h-16 rounded-lg border text-sm font-medium vault-quiet-hover focus-ring',
                    'text-text-secondary border-border hover:border-border-strong hover:bg-surface-interactive',
                    'transition-all duration-standard ease-premium',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {submitting && (
              <div className="mt-4 text-center text-xs text-text-tertiary animate-fade-in">
                Logging check-in...
              </div>
            )}
          </div>
        )}

        {/* CAUSE PHASE */}
        {phase === 'cause' && (
          <div className="animate-fade-in">
            <div className="mb-6 text-center">
              <div className="text-[0.6875rem] uppercase tracking-[0.15em] text-text-tertiary font-medium mb-2">
                Session Check-In
              </div>
              <h2 className="text-h2 text-text-primary font-semibold">
                What's going on?
              </h2>
            </div>
            <div className="space-y-2.5">
              {causes.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleCauseSelect(c.value)}
                  disabled={submitting}
                  className={cn(
                    'w-full h-14 rounded-lg border text-sm font-medium vault-quiet-hover focus-ring',
                    'text-text-secondary border-border hover:border-border-strong hover:bg-surface-interactive',
                    'flex items-center justify-between px-5 transition-all duration-standard ease-premium',
                  )}
                >
                  <span>{c.label}</span>
                  <ChevronRight className="w-4 h-4 text-text-tertiary" />
                </button>
              ))}
            </div>
            {submitting && (
              <div className="mt-4 text-center text-xs text-text-tertiary animate-fade-in">
                Processing...
              </div>
            )}
          </div>
        )}

        {/* RESPONSE PHASE */}
        {phase === 'response' && checkIn && (
          <div className="animate-fade-in">
            {isCleared && (
              <ResponseCard
                icon={<ShieldCheck className="w-7 h-7 text-positive" />}
                title="Session Cleared"
                subtitle="Platform access unlocked"
                tone="positive"
                actionLabel="Enter Vault"
                onAction={onComplete}
              />
            )}

            {isBlocked && (
              <ResponseCard
                icon={<Lock className="w-7 h-7 text-negative" />}
                title="Session Restricted"
                subtitle={`Platform access locked · Unlocks at ${checkIn.block_until ? formatBlockTime(new Date(checkIn.block_until)) : 'later'}`}
                message={checkIn.message ?? undefined}
                tone="negative"
                actionLabel="Understood"
                onAction={onComplete}
                blocked
              />
            )}

            {isSoftWarning && (
              <div>
                <ResponseCard
                  icon={<AlertTriangle className="w-7 h-7 text-warning" />}
                  title="Soft Warning"
                  message={checkIn.message ?? undefined}
                  tone="warning"
                />
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleAcknowledge}
                    disabled={submitting}
                    className={cn(
                      'w-full h-12 rounded-lg vault-primary-glow text-bg text-sm font-semibold focus-ring',
                      'transition-all duration-standard ease-premium active:scale-[0.98]',
                    )}
                  >
                    I understand, continue anyway
                  </button>
                  <button
                    onClick={onComplete}
                    className="w-full h-10 rounded-lg text-sm font-medium text-text-tertiary hover:text-text-secondary vault-quiet-hover focus-ring"
                  >
                    Step back
                  </button>
                </div>
              </div>
            )}

            {/* If soft warning already acknowledged or status cleared after block expired */}
            {status === 'cleared' && !isCleared && (checkIn.acknowledged || checkIn.action === 'soft_warning') && (
              <ResponseCard
                icon={<ShieldCheck className="w-7 h-7 text-positive" />}
                title="Session Cleared"
                subtitle="Platform access unlocked"
                tone="positive"
                actionLabel="Enter Vault"
                onAction={onComplete}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResponseCard({
  icon,
  title,
  subtitle,
  message,
  tone,
  actionLabel,
  onAction,
  blocked,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  message?: string;
  tone: 'positive' | 'negative' | 'warning';
  actionLabel?: string;
  onAction?: () => void;
  blocked?: boolean;
}) {
  const toneClass = {
    positive: 'border-positive/30 bg-positive/5',
    negative: 'border-negative/30 bg-negative/5',
    warning: 'border-warning/30 bg-warning/5',
  }[tone];

  return (
    <div className={cn('rounded-xl border p-6 text-center animate-fade-up', toneClass)}>
      <div className={cn(
        'w-14 h-14 mx-auto rounded-full border flex items-center justify-center mb-5',
        tone === 'positive' && 'border-positive/30 bg-positive/10',
        tone === 'negative' && 'border-negative/30 bg-negative/10',
        tone === 'warning' && 'border-warning/30 bg-warning/10',
      )}>
        {icon}
      </div>
      <h2 className="text-h2 text-text-primary font-semibold">{title}</h2>
      {subtitle && (
        <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-text-secondary">
          {blocked && <Clock className="w-3.5 h-3.5" />}
          {subtitle}
        </div>
      )}
      {message && (
        <p className="mt-5 text-sm text-text-secondary leading-relaxed italic">
          "{message}"
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={cn(
            'mt-6 w-full h-12 rounded-lg text-sm font-semibold focus-ring',
            'transition-all duration-standard ease-premium active:scale-[0.98]',
            tone === 'positive' && 'vault-primary-glow text-bg',
            tone === 'negative' && 'vault-surface text-text-secondary border-border hover:border-border-strong vault-action-hover',
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
