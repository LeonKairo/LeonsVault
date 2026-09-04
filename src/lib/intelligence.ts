import type { Trade, Insight, Session, Direction } from '@/types';
import { formatR, formatCurrency } from '@/data/mockData';

// ================================================================
// PERFORMANCE AGGREGATION PRIMITIVES
// ================================================================

interface PerformanceStats {
  count: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number;
  totalR: number;
  avgR: number;
  totalPnl: number;
}

const EMPTY_STATS: PerformanceStats = {
  count: 0,
  wins: 0,
  losses: 0,
  breakevens: 0,
  winRate: 0,
  totalR: 0,
  avgR: 0,
  totalPnl: 0,
};

function computeStats(trades: Trade[]): PerformanceStats {
  if (trades.length === 0) return EMPTY_STATS;
  let wins = 0, losses = 0, breakevens = 0, totalR = 0, totalPnl = 0;
  for (const t of trades) {
    if (t.outcome === 'win') wins++;
    else if (t.outcome === 'loss') losses++;
    else breakevens++;
    totalR += t.rMultiple;
    totalPnl += t.pnl;
  }
  return {
    count: trades.length,
    wins,
    losses,
    breakevens,
    winRate: trades.length > 0 ? (wins / trades.length) * 100 : 0,
    totalR: Math.round(totalR * 100) / 100,
    avgR: trades.length > 0 ? Math.round((totalR / trades.length) * 100) / 100 : 0,
    totalPnl: Math.round(totalPnl * 100) / 100,
  };
}

function groupBy<K extends string>(trades: Trade[], keyFn: (t: Trade) => K): Map<K, Trade[]> {
  const map = new Map<K, Trade[]>();
  for (const t of trades) {
    const key = keyFn(t);
    const arr = map.get(key);
    if (arr) arr.push(t);
    else map.set(key, [t]);
  }
  return map;
}

// ================================================================
// CATEGORY PERFORMANCE
// ================================================================

export interface CategoryPerformance {
  name: string;
  stats: PerformanceStats;
}

export function calculateSessionPerformance(trades: Trade[]): CategoryPerformance[] {
  const grouped = groupBy(trades, (t) => t.session as string);
  const results: CategoryPerformance[] = [];
  for (const [name, group] of grouped) {
    results.push({ name, stats: computeStats(group) });
  }
  results.sort((a, b) => b.stats.totalR - a.stats.totalR);
  return results;
}

export function calculateStrategyPerformance(trades: Trade[]): CategoryPerformance[] {
  const grouped = groupBy(trades, (t) => t.strategy);
  const results: CategoryPerformance[] = [];
  for (const [name, group] of grouped) {
    results.push({ name, stats: computeStats(group) });
  }
  results.sort((a, b) => b.stats.totalR - a.stats.totalR);
  return results;
}

export function calculateSymbolPerformance(trades: Trade[]): CategoryPerformance[] {
  const grouped = groupBy(trades, (t) => t.symbol);
  const results: CategoryPerformance[] = [];
  for (const [name, group] of grouped) {
    results.push({ name, stats: computeStats(group) });
  }
  results.sort((a, b) => b.stats.totalR - a.stats.totalR);
  return results;
}

export function calculateDirectionPerformance(trades: Trade[]): CategoryPerformance[] {
  const grouped = groupBy(trades, (t) => t.direction);
  const results: CategoryPerformance[] = [];
  for (const [name, group] of grouped) {
    results.push({ name, stats: computeStats(group) });
  }
  results.sort((a, b) => b.stats.totalR - a.stats.totalR);
  return results;
}

// ================================================================
// SAMPLE SIZE GUARD
// ================================================================

const MIN_SAMPLE = 3;

function hasEnoughData(stats: PerformanceStats, min: number = MIN_SAMPLE): boolean {
  return stats.count >= min;
}

// ================================================================
// BEHAVIORAL PATTERN DETECTION
// ================================================================

export interface BehaviorPattern {
  tag: string;
  stats: PerformanceStats;
  label: string;
  isWeakness: boolean;
}

const BEHAVIORAL_TAGS = [
  'Revenge',
  'Overtrading',
  'FOMO',
  'Early Entry',
  'Late Entry',
  'Counter-trend',
  'A+ setup',
  'Trend',
  'Range',
  'Breakout',
  'Liquidity',
  'London Open',
  'Overlap',
];

export function calculateBehaviorPatterns(trades: Trade[]): BehaviorPattern[] {
  const patterns: BehaviorPattern[] = [];
  for (const tag of BEHAVIORAL_TAGS) {
    const tagged = trades.filter((t) => t.tags.includes(tag));
    if (tagged.length < 2) continue;
    const stats = computeStats(tagged);
    const overallAvgR = trades.length > 0
      ? trades.reduce((s, t) => s + t.rMultiple, 0) / trades.length
      : 0;
    const isWeakness = stats.avgR < overallAvgR && tag !== 'A+ setup';
    const label = isWeakness ? 'Behavioral Weakness' : 'Behavioral Strength';
    patterns.push({ tag, stats, label, isWeakness });
  }
  patterns.sort((a, b) => a.stats.avgR - b.stats.avgR);
  return patterns;
}

// ================================================================
// POST-LOSS BEHAVIOR
// ================================================================

export interface PostLossStats {
  postLossTrades: PerformanceStats;
  overallAvgR: number;
  sampleSize: number;
  hasEnoughData: boolean;
}

export function calculatePostLossPerformance(trades: Trade[]): PostLossStats {
  const sorted = [...trades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const postLoss: Trade[] = [];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1].outcome === 'loss') {
      postLoss.push(sorted[i]);
    }
  }
  const overallAvgR = sorted.length > 0
    ? Math.round((sorted.reduce((s, t) => s + t.rMultiple, 0) / sorted.length) * 100) / 100
    : 0;
  return {
    postLossTrades: computeStats(postLoss),
    overallAvgR,
    sampleSize: postLoss.length,
    hasEnoughData: postLoss.length >= MIN_SAMPLE,
  };
}

// ================================================================
// INSIGHT GENERATION
// ================================================================

function formatRValue(r: number): string {
  const sign = r >= 0 ? '+' : '';
  return `${sign}${r.toFixed(1)}R`;
}

function generateBestSession(sessions: CategoryPerformance[]): Insight | null {
  if (sessions.length === 0) return null;
  const best = sessions[0];
  if (!hasEnoughData(best.stats)) {
    return {
      id: 'insight-session',
      type: 'edge',
      label: 'Best Session',
      title: 'Not enough data yet',
      description: 'More trades are needed before the Vault can identify your strongest session.',
    };
  }
  return {
    id: 'insight-session',
    type: 'edge',
    label: 'Strongest Session',
    title: best.name,
    description: `Your strongest session is ${best.name}, producing ${formatRValue(best.stats.totalR)} across ${best.stats.count} trades with a ${best.stats.winRate.toFixed(0)}% win rate.`,
    metric: 'Session R',
    value: formatRValue(best.stats.totalR),
    rMultiple: best.stats.totalR,
  };
}

function generateBestStrategy(strategies: CategoryPerformance[]): Insight | null {
  if (strategies.length === 0) return null;
  const best = strategies[0];
  if (!hasEnoughData(best.stats)) {
    return {
      id: 'insight-strategy',
      type: 'edge',
      label: 'Best Strategy',
      title: 'Not enough data yet',
      description: 'More trades are needed before the Vault can identify your most effective strategy.',
    };
  }
  return {
    id: 'insight-strategy',
    type: 'edge',
    label: 'Strongest Strategy',
    title: best.name,
    description: `${best.name} has generated ${formatRValue(best.stats.totalR)} across ${best.stats.count} trades, averaging ${formatR(best.stats.avgR)} per trade with a ${best.stats.winRate.toFixed(0)}% win rate.`,
    metric: 'Strategy R',
    value: formatRValue(best.stats.totalR),
    rMultiple: best.stats.totalR,
  };
}

function generateSymbolInsight(symbols: CategoryPerformance[]): Insight | null {
  if (symbols.length === 0) return null;
  const best = symbols[0];
  const worst = symbols[symbols.length - 1];
  if (hasEnoughData(best.stats)) {
    return {
      id: 'insight-symbol-best',
      type: 'edge',
      label: 'Best Symbol',
      title: best.name,
      description: `${best.name} is your most profitable symbol with ${formatRValue(best.stats.totalR)} across ${best.stats.count} trades.`,
      metric: 'Symbol R',
      value: formatRValue(best.stats.totalR),
      rMultiple: best.stats.totalR,
    };
  }
  if (hasEnoughData(worst.stats) && worst.stats.totalR < 0) {
    return {
      id: 'insight-symbol-worst',
      type: 'weakness',
      label: 'Weakest Symbol',
      title: worst.name,
      description: `${worst.name} has been your weakest symbol at ${formatRValue(worst.stats.totalR)} across ${worst.stats.count} trades. Consider whether your edge truly applies here.`,
      metric: 'Symbol R',
      value: formatRValue(worst.stats.totalR),
      rMultiple: worst.stats.totalR,
    };
  }
  return {
    id: 'insight-symbol',
    type: 'edge',
    label: 'Best Symbol',
    title: 'Not enough data yet',
    description: 'More trades per symbol are needed before the Vault can identify a reliable edge.',
  };
}

function generateDirectionInsight(directions: CategoryPerformance[]): Insight | null {
  if (directions.length < 2) return null;
  const [first, second] = directions;
  const better = first.stats.totalR >= second.stats.totalR ? first : second;
  const worse = first.stats.totalR >= second.stats.totalR ? second : first;
  if (!hasEnoughData(better.stats)) return null;
  const diff = better.stats.avgR - worse.stats.avgR;
  if (Math.abs(diff) < 0.3) return null;
  const isEdge = better.stats.avgR > worse.stats.avgR;
  return {
    id: 'insight-direction',
    type: isEdge ? 'edge' : 'pattern',
    label: 'Long vs Short',
    title: `${better.name} outperforms ${worse.name}`,
    description: `Your ${better.name} trades average ${formatR(better.stats.avgR)} across ${better.stats.count} trades, while ${worse.name} trades average ${formatR(worse.stats.avgR)} across ${worse.stats.count} trades.`,
    metric: 'Directional Avg R',
    value: formatR(better.stats.avgR),
    rMultiple: better.stats.avgR,
  };
}

function generateBehaviorInsight(patterns: BehaviorPattern[]): Insight | null {
  const weaknesses = patterns.filter((p) => p.isWeakness && p.stats.count >= 2);
  if (weaknesses.length === 0) return null;
  const worst = weaknesses[0];
  return {
    id: 'insight-behavior',
    type: 'weakness',
    label: 'Behavioral Pattern',
    title: `${worst.tag} trades are underperforming`,
    description: `Trades tagged "${worst.tag}" have produced ${formatRValue(worst.stats.totalR)} across ${worst.stats.count} trades with a ${worst.stats.winRate.toFixed(0)}% win rate, performing worse than your overall average.`,
    metric: `${worst.tag} R`,
    value: formatRValue(worst.stats.totalR),
    rMultiple: worst.stats.totalR,
  };
}

function generatePostLossInsight(postLoss: PostLossStats): Insight | null {
  if (!postLoss.hasEnoughData) return null;
  const diff = postLoss.postLossTrades.avgR - postLoss.overallAvgR;
  if (Math.abs(diff) < 0.2) return null;
  const isWeakness = diff < 0;
  return {
    id: 'insight-post-loss',
    type: isWeakness ? 'weakness' : 'pattern',
    label: 'Post-Loss Behavior',
    title: isWeakness
      ? 'Performance drops after a loss'
      : 'Performance improves after a loss',
    description: `Your next trade after a loss has averaged ${formatR(postLoss.postLossTrades.avgR)} across ${postLoss.sampleSize} trades, compared to your overall average of ${formatR(postLoss.overallAvgR)}.`,
    metric: 'Post-Loss Avg R',
    value: formatR(postLoss.postLossTrades.avgR),
    rMultiple: postLoss.postLossTrades.avgR,
  };
}

export function generateInsights(trades: Trade[]): Insight[] {
  if (trades.length < 3) {
    return [
      {
        id: 'insight-low-data',
        type: 'pattern',
        label: 'Still Learning',
        title: 'Still learning your pattern',
        description: 'More trades are needed before the Vault can identify a reliable edge. Continue journaling your setups, psychology, and reflections.',
      },
    ];
  }
  const sessions = calculateSessionPerformance(trades);
  const strategies = calculateStrategyPerformance(trades);
  const symbols = calculateSymbolPerformance(trades);
  const directions = calculateDirectionPerformance(trades);
  const patterns = calculateBehaviorPatterns(trades);
  const postLoss = calculatePostLossPerformance(trades);

  const insights: (Insight | null)[] = [
    generateBestSession(sessions),
    generateBestStrategy(strategies),
    generateSymbolInsight(symbols),
    generateDirectionInsight(directions),
    generateBehaviorInsight(patterns),
    generatePostLossInsight(postLoss),
  ];

  return insights.filter((i): i is Insight => i !== null);
}

// ================================================================
// TRUTH INSIGHTS
// ================================================================

export interface TruthInsight {
  label: string;
  title: string;
  value: string;
  description: string;
}

export function generateTruthInsights(trades: Trade[]): TruthInsight[] {
  if (trades.length < 3) {
    return [
      {
        label: 'The Truth',
        title: 'Not enough data yet',
        value: '—',
        description: 'The Vault needs more trades before it can reveal your truth. Keep journaling.',
      },
    ];
  }

  const truths: TruthInsight[] = [];
  const strategies = calculateStrategyPerformance(trades);
  const sessions = calculateSessionPerformance(trades);
  const symbols = calculateSymbolPerformance(trades);
  const patterns = calculateBehaviorPatterns(trades);
  const postLoss = calculatePostLossPerformance(trades);

  // Strongest edge
  const bestStrategy = strategies.find((s) => hasEnoughData(s.stats));
  if (bestStrategy) {
    truths.push({
      label: 'Your Best Edge',
      title: bestStrategy.name,
      value: formatRValue(bestStrategy.stats.totalR),
      description: `${bestStrategy.name} is your most consistent edge, generating ${formatRValue(bestStrategy.stats.totalR)} across ${bestStrategy.stats.count} trades with a ${bestStrategy.stats.winRate.toFixed(0)}% win rate.`,
    });
  }

  // Biggest weakness — behavioral tag with worst R
  const weaknesses = patterns.filter((p) => p.isWeakness && p.stats.count >= 2);
  if (weaknesses.length > 0) {
    const worst = weaknesses[0];
    truths.push({
      label: 'Your Worst Habit',
      title: worst.tag,
      value: formatRValue(worst.stats.totalR),
      description: `Trades tagged "${worst.tag}" have cost you ${formatRValue(worst.stats.totalR)} across ${worst.stats.count} trades. These are performing worse than your normal trades.`,
    });
  }

  // Largest source of lost R — worst session
  const worstSession = sessions[sessions.length - 1];
  if (worstSession && hasEnoughData(worstSession.stats) && worstSession.stats.totalR < 0) {
    truths.push({
      label: 'Most Expensive Session',
      title: worstSession.name,
      value: formatRValue(worstSession.stats.totalR),
      description: `${worstSession.name} has been your most expensive session at ${formatRValue(worstSession.stats.totalR)} across ${worstSession.stats.count} trades. Consider reducing activity here.`,
    });
  }

  // Post-loss behavior truth
  if (postLoss.hasEnoughData) {
    const diff = postLoss.postLossTrades.avgR - postLoss.overallAvgR;
    if (diff < -0.2) {
      truths.push({
        label: 'Post-Loss Behavior',
        title: 'Recovery trades underperform',
        value: formatR(postLoss.postLossTrades.avgR),
        description: `Your next trade after a loss averages ${formatR(postLoss.postLossTrades.avgR)} versus ${formatR(postLoss.overallAvgR)} overall. The data suggests discipline weakens after a loss.`,
      });
    }
  }

  // Consistency truth — win rate and breakeven ratio
  const allStats = computeStats(trades);
  if (allStats.count > 0) {
    truths.push({
      label: 'Overall Consistency',
      title: `${allStats.winRate.toFixed(0)}% Win Rate`,
      value: formatRValue(allStats.totalR),
      description: `Across ${allStats.count} trades, you've generated ${formatRValue(allStats.totalR)} (${formatCurrency(allStats.totalPnl)}) with a ${allStats.winRate.toFixed(0)}% win rate and ${allStats.breakevens} breakeven${allStats.breakevens !== 1 ? 's' : ''}.`,
    });
  }

  return truths.length > 0 ? truths : [
    {
      label: 'The Truth',
      title: 'Your edge is emerging',
      value: formatRValue(allStats.totalR),
      description: `Across ${allStats.count} trades, your results suggest a developing edge. Continue journaling to reveal clearer patterns.`,
    },
  ];
}
