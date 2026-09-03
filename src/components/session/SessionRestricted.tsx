import { Lock, Clock, ShieldCheck } from 'lucide-react';
import { useSessionCheckIn } from '@/session/SessionCheckInProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/lib/utils';

export function SessionRestricted() {
  const { blockUntil, refetch } = useSessionCheckIn();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const remaining = blockUntil ? blockUntil.getTime() - Date.now() : 0;
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className={cn(
      'fixed inset-0 z-40 flex items-center justify-center bg-bg',
    )}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgb(var(--negative) / ${isDark ? 0.04 : 0.02}) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full border border-negative/30 bg-negative/10 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-negative" />
        </div>

        <h1 className="text-h1 text-text-primary font-semibold">Session Restricted</h1>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-text-secondary">
          <Clock className="w-4 h-4" />
          <span>Platform access locked · Unlocks at {blockUntil ? formatTime(blockUntil) : 'later'}</span>
        </div>

        {remaining > 0 && (
          <div className="mt-6 rounded-xl border border-border vault-surface p-6">
            <div className="text-[0.6875rem] uppercase tracking-[0.15em] text-text-tertiary font-medium mb-3">
              Time Remaining
            </div>
            <div className="text-h2 font-semibold text-text-primary tabular-nums">
              {hours > 0 && `${hours}h `}{minutes}m
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-border vault-surface p-5">
          <p className="text-sm text-text-secondary leading-relaxed">
            Only live trading and platform access are restricted.
            The rest of Leon's Vault — analytics, calendar, intelligence, DNA — remains accessible.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover vault-quiet-hover focus-ring px-4 h-10 rounded-lg"
        >
          <ShieldCheck className="w-4 h-4" />
          Check status
        </button>
      </div>
    </div>
  );
}
