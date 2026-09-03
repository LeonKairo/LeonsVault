import { HeroEquity } from '@/components/dashboard/HeroEquity';
import { MetricsGrid } from '@/components/dashboard/Metrics';
import { EquityCurveSection } from '@/components/dashboard/EquityCurveSection';
import { CalendarPreview } from '@/components/dashboard/CalendarPreview';
import { RecentTrades } from '@/components/dashboard/RecentTrades';
import { AccountSelector } from '@/components/layout/AccountSelector';
import { useSessionCheckIn } from '@/session/SessionCheckInProvider';
import { ShieldCheck } from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning, Leon.';
  if (hour < 18) return 'Good afternoon, Leon.';
  return 'Good evening, Leon.';
}

function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function StartSessionButton() {
  const { startSession, loading, blocked, sessionActive } = useSessionCheckIn();

  if (loading || blocked || sessionActive) return null;

  return (
    <button
      onClick={startSession}
      className="inline-flex items-center gap-2.5 h-11 px-5 rounded-lg vault-primary-glow text-bg text-sm font-semibold focus-ring transition-all duration-standard ease-premium active:scale-[0.98] animate-fade-in"
    >
      <ShieldCheck className="w-4 h-4" />
      Start Session
    </button>
  );
}

export function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-h1 text-text-primary">{getGreeting()}</h1>
          <p className="text-sm text-text-secondary mt-1">{getCurrentDate()}</p>
        </div>
        <div className="flex items-center gap-3">
          <StartSessionButton />
          <AccountSelector />
        </div>
      </div>

      {/* Hero equity + secondary metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HeroEquity />
        </div>
        <div className="lg:col-span-1">
          <CompactStats />
        </div>
      </div>

      {/* Secondary metrics */}
      <MetricsGrid />

      {/* Equity curve */}
      <EquityCurveSection />

      {/* Calendar + Recent trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalendarPreview />
        <RecentTrades />
      </div>
    </div>
  );
}

import { Card, SectionLabel } from '@/components/ui/Card';
import { Target, Award, Activity, Zap } from 'lucide-react';
import { dashboardStats, formatCurrency, formatR } from '@/data/mockData';

function CompactStats() {
  const stats = dashboardStats;
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <Card className="p-5 flex flex-col justify-between animate-fade-up animate-delay-100">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-text-tertiary" />
          <SectionLabel>Win Rate</SectionLabel>
        </div>
        <div>
          <div className="text-card-lg font-semibold text-text-primary">{stats.winRate.toFixed(0)}%</div>
          <div className="text-xs text-text-tertiary mt-1">{stats.wins}W · {stats.losses}L</div>
        </div>
      </Card>
      <Card className="p-5 flex flex-col justify-between animate-fade-up animate-delay-200">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-text-tertiary" />
          <SectionLabel>Best Trade</SectionLabel>
        </div>
        <div>
          <div className="text-card-lg font-semibold text-positive">{formatR(stats.bestTrade.rMultiple)}</div>
          <div className="text-xs text-text-tertiary mt-1">{stats.bestTrade.symbol}</div>
        </div>
      </Card>
      <Card className="p-5 flex flex-col justify-between animate-fade-up animate-delay-300">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-text-tertiary" />
          <SectionLabel>Avg R</SectionLabel>
        </div>
        <div>
          <div className="text-card-lg font-semibold text-text-primary">{formatR(stats.avgR)}</div>
          <div className="text-xs text-text-tertiary mt-1">per trade</div>
        </div>
      </Card>
      <Card className="p-5 flex flex-col justify-between animate-fade-up animate-delay-400">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-text-tertiary" />
          <SectionLabel>Net P&L</SectionLabel>
        </div>
        <div>
          <div className={`text-card-lg font-semibold ${stats.netPnl >= 0 ? 'text-positive' : 'text-negative'}`}>
            {stats.netPnl >= 0 ? '+' : ''}{formatCurrency(stats.netPnl)}
          </div>
          <div className="text-xs text-text-tertiary mt-1">{stats.totalTrades} trades</div>
        </div>
      </Card>
    </div>
  );
}
