import { TrendingUp, Clock, Target, Shield, AlertTriangle, Zap } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { tradingDNA } from '@/data/mockData';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/lib/utils';

const nodes = [
  { key: 'bestPair', label: 'Best Pair', icon: TrendingUp, angle: -90 },
  { key: 'bestSession', label: 'Best Session', icon: Clock, angle: -30 },
  { key: 'bestStrategy', label: 'Best Strategy', icon: Target, angle: 30 },
  { key: 'disciplineScore', label: 'Discipline', icon: Shield, angle: 90 },
  { key: 'primaryWeakness', label: 'Weakness', icon: AlertTriangle, angle: 150 },
  { key: 'emotionalTrigger', label: 'Trigger', icon: Zap, angle: 210 },
];

export function DnaPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lineColor = isDark ? 'rgba(201, 169, 110, 0.2)' : 'rgba(120, 95, 50, 0.15)';
  const lineColorActive = isDark ? 'rgba(201, 169, 110, 0.4)' : 'rgba(120, 95, 50, 0.3)';

  const getValue = (key: string): { name: string; value: string; sub?: string } => {
    switch (key) {
      case 'bestPair': return { name: tradingDNA.bestPair.name, value: tradingDNA.bestPair.value, sub: tradingDNA.bestPair.winRate + ' WR' };
      case 'bestSession': return { name: tradingDNA.bestSession.name, value: tradingDNA.bestSession.winRate, sub: 'win rate' };
      case 'bestStrategy': return { name: tradingDNA.bestStrategy.name, value: tradingDNA.bestStrategy.value, sub: tradingDNA.bestStrategy.winRate + ' WR' };
      case 'disciplineScore': return { name: tradingDNA.disciplineScore.value, value: tradingDNA.disciplineScore.label, sub: 'score' };
      case 'primaryWeakness': return { name: tradingDNA.primaryWeakness.name, value: tradingDNA.primaryWeakness.value };
      case 'emotionalTrigger': return { name: tradingDNA.emotionalTrigger.name, value: tradingDNA.emotionalTrigger.value };
      default: return { name: '—', value: '—' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-h1 text-text-primary">Trading DNA</h1>
        <p className="text-sm text-text-secondary mt-1.5">The genetic code of your trading identity.</p>
      </div>

      {/* DNA Visualization */}
      <Card variant="elevated" className="p-8 animate-fade-up overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent/3 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-center" style={{ minHeight: '480px' }}>
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid meet">
            {nodes.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const x = 300 + Math.cos(rad) * 180;
              const y = 240 + Math.sin(rad) * 160;
              return (
                <line
                  key={node.key}
                  x1="300"
                  y1="240"
                  x2={x}
                  y2={y}
                  stroke={lineColor}
                  strokeWidth="1"
                  strokeDasharray="3 5"
                >
                  <animate attributeName="stroke" values={`${lineColor};${lineColorActive};${lineColor}`} dur="4s" repeatCount="indefinite" begin={`${nodes.indexOf(node) * 0.5}s`} />
                </line>
              );
            })}
            {/* Outer ring */}
            <circle cx="300" cy="240" r="180" fill="none" stroke={lineColor} strokeWidth="1" strokeDasharray="2 8" opacity="0.5">
              <animateTransform attributeName="transform" type="rotate" from="0 300 240" to="360 300 240" dur="60s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Center */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center"
              style={{ boxShadow: isDark ? '0 0 32px rgb(var(--accent-glow) / 0.12)' : '0 0 24px rgb(var(--accent-glow) / 0.06)' }}
            >
              <span className="text-display font-semibold text-accent">L</span>
            </div>
            <div className="mt-3 text-center">
              <div className="text-h3 font-semibold text-text-primary">LEON</div>
              <div className="text-xs text-text-tertiary uppercase tracking-wider mt-0.5">Trader DNA</div>
            </div>
          </div>

          {/* Nodes */}
          {nodes.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = 50 + Math.cos(rad) * 30;
            const y = 50 + Math.sin(rad) * 33;
            const Icon = node.icon;
            const data = getValue(node.key);
            const isNegative = node.key === 'primaryWeakness';

            return (
              <div
                key={node.key}
                className="absolute z-10 animate-scale-in"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 120 + 300}ms`,
                  animationFillMode: 'both',
                }}
              >
                <div className="w-36 vault-surface rounded-xl p-3.5 hover:border-border-strong transition-colors duration-standard group">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      'w-6 h-6 rounded-md flex items-center justify-center',
                      isNegative ? 'bg-negative/10 text-negative' : 'bg-surface-interactive text-text-tertiary'
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <SectionLabel className="text-[0.625rem]">{node.label}</SectionLabel>
                  </div>
                  <div className="text-sm font-semibold text-text-primary truncate">{data.name}</div>
                  <div className={cn(
                    'text-xs font-medium mt-0.5',
                    isNegative ? 'text-negative' : 'text-accent'
                  )}>
                    {data.value}
                    {data.sub && <span className="text-text-tertiary ml-1">· {data.sub}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5 animate-fade-up">
          <SectionLabel>Discipline Score</SectionLabel>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-card-lg font-semibold text-accent">{tradingDNA.disciplineScore.value}</span>
            <span className="text-sm text-text-tertiary">/ 100</span>
          </div>
          <div className="text-xs text-text-secondary mt-1">{tradingDNA.disciplineScore.label}</div>
        </Card>
        <Card className="p-5 animate-fade-up animate-delay-100">
          <SectionLabel>Total Edge</SectionLabel>
          <div className="text-card-lg font-semibold text-positive mt-2">{tradingDNA.bestStrategy.value}</div>
          <div className="text-xs text-text-tertiary mt-1">{tradingDNA.bestStrategy.name}</div>
        </Card>
        <Card className="p-5 animate-fade-up animate-delay-200 col-span-2 lg:col-span-1">
          <SectionLabel>Primary Risk</SectionLabel>
          <div className="text-card-lg font-semibold text-negative mt-2">{tradingDNA.primaryWeakness.value}</div>
          <div className="text-xs text-text-tertiary mt-1">{tradingDNA.primaryWeakness.name}</div>
        </Card>
      </div>
    </div>
  );
}
