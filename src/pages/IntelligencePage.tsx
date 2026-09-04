import { useState, useMemo } from 'react';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb, Eye } from 'lucide-react';
import { Card, SectionLabel } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { trades } from '@/data/mockData';
import { generateInsights, generateTruthInsights } from '@/lib/intelligence';
import { cn } from '@/lib/utils';

type Phase = 'analyzing' | 'results' | 'truth';

export function IntelligencePage() {
  const [phase, setPhase] = useState<Phase>('analyzing');
  const [showTruth, setShowTruth] = useState(false);

  const insights = useMemo(() => generateInsights(trades), []);
  const truthInsights = useMemo(() => generateTruthInsights(trades), []);
  const tradeCount = trades.length;

  if (phase === 'analyzing') {
    return (
      <div className="max-w-md mx-auto pt-16">
        <div className="text-center animate-fade-in">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border border-accent/20 animate-pulse-ring" />
            <div className="absolute inset-2 rounded-full border border-accent/30 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-4 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center">
              <Brain className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h2 className="text-h2 text-text-primary mb-2">Looking through your trading history.</h2>
          <p className="text-sm text-text-tertiary">Analyzing patterns, edges, and behaviors...</p>

          <div className="mt-8 space-y-2 max-w-xs mx-auto">
            {[`Scanning ${tradeCount} trades`, 'Identifying session patterns', 'Detecting behavioral trends'].map((text, i) => (
              <div
                key={text}
                className="flex items-center justify-center gap-2 text-xs text-text-tertiary animate-fade-up"
                style={{ animationDelay: `${i * 600}ms`, animationFillMode: 'both' }}
              >
                <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                {text}
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            className="mt-10"
            onClick={() => setPhase('results')}
          >
            <Sparkles className="w-4 h-4" />
            Reveal Insights
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'truth' || showTruth) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pt-4">
        <div className="text-center animate-fade-in">
          <h1 className="text-h1 text-text-primary">The Truth.</h1>
          <p className="text-sm text-text-secondary mt-2">No excuses. No narratives. Just the numbers.</p>
        </div>

        <div className="space-y-6">
          {truthInsights.map((item, i) => (
            <Card
              key={item.label}
              variant="elevated"
              className="p-7 animate-fade-up vault-atmosphere vault-edge-luminous overflow-hidden"
              style={{ animationDelay: `${i * 200}ms`, animationFillMode: 'both' }}
            >
              <SectionLabel>{item.label}</SectionLabel>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <h3 className="text-h2 text-text-primary">{item.title}</h3>
                <span className={cn(
                  'text-h2 font-semibold whitespace-nowrap',
                  item.value.startsWith('-') ? 'text-negative' : item.value.startsWith('+') ? 'text-positive' : 'text-accent'
                )}>
                  {item.value}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-up animate-delay-700 pt-4">
          <p className="text-base text-text-tertiary italic">
            "The numbers don't judge you. They just remember."
          </p>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => { setPhase('results'); setShowTruth(false); }}>
            Back to Insights
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-h1 text-text-primary">Vault Intelligence</h1>
          <p className="text-sm text-text-secondary mt-1.5">Patterns discovered in your trading behavior.</p>
        </div>
        <Button variant="gold" onClick={() => setShowTruth(true)}>
          <Eye className="w-4 h-4" />
          Show Me The Truth
        </Button>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight, i) => {
          const isPattern = insight.type === 'pattern';
          const isEdge = insight.type === 'edge';
          const isWeakness = insight.type === 'weakness';
          const Icon = isPattern ? Lightbulb : isEdge ? TrendingUp : AlertTriangle;
          const tone = isEdge ? 'text-positive' : isWeakness ? 'text-negative' : 'text-accent';
          const bgTone = isEdge ? 'bg-positive/10' : isWeakness ? 'bg-negative/10' : 'bg-accent/10';

          return (
            <Card
              key={insight.id}
              variant="elevated"
              className="p-6 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', bgTone, tone)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <SectionLabel>{insight.label}</SectionLabel>
                  <h3 className="text-h3 text-text-primary mt-1.5">{insight.title}</h3>
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed">{insight.description}</p>
                  {insight.value && (
                    <div className={cn('text-lg font-semibold mt-3', tone)}>
                      {insight.value}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
