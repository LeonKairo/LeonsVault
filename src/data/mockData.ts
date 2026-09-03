import type {
  Trade,
  EquityPoint,
  CalendarDay,
  TradingAccount,
  Insight,
  ReplayEvent,
} from '@/types';

export const accounts: TradingAccount[] = [
  {
    id: 'acc-1',
    name: 'My 2.5K Evaluation',
    broker: 'FTMO',
    balance: 2500,
    equity: 2547.8,
    type: 'Evaluation',
    currency: 'USD',
    color: '#c9a96e',
  },
  {
    id: 'acc-2',
    name: '10K Funded',
    broker: 'IC Markets',
    balance: 10000,
    equity: 10842.5,
    type: 'Funded',
    currency: 'USD',
    color: '#4ac88e',
  },
  {
    id: 'acc-3',
    name: 'Personal Live',
    broker: 'Pepperstone',
    balance: 5000,
    equity: 4892.3,
    type: 'Live',
    currency: 'USD',
    color: '#7a8ca8',
  },
];

const symbols = [
  'XAUUSD',
  'EURUSD',
  'GBPJPY',
  'USDJPY',
  'US30',
  'NAS100',
  'BTCUSD',
  'AUDUSD',
];

const strategies = [
  'London Sweep',
  'NY Open Drive',
  'Liquidity Grab',
  'Breakout Retest',
  'Trend Pullback',
  'Range Reversal',
];

const sessions = [
  'London',
  'New York',
  'Tokyo',
  'London/NY Overlap',
] as const;

function dateOffset(daysAgo: number, hour = 0, minute = 0): string {
  const d = new Date(2026, 7, 27, hour, minute);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

const tradeTemplates: Array<
  Pick<
    Trade,
    | 'symbol'
    | 'direction'
    | 'outcome'
    | 'rMultiple'
    | 'session'
    | 'strategy'
    | 'hasScreenshot'
    | 'reasoning'
    | 'psychology'
    | 'reflection'
    | 'whatWentRight'
    | 'whatWentWrong'
    | 'lesson'
    | 'tags'
  > & { hour: number; minute: number; daysAgo: number; entry: number }
> = [
  {
    symbol: 'XAUUSD',
    direction: 'LONG',
    outcome: 'win',
    rMultiple: 2.4,
    session: 'London',
    strategy: 'London Sweep',
    hasScreenshot: true,
    entry: 2512.4,
    hour: 8,
    minute: 32,
    daysAgo: 0,
    tags: ['A+ setup', 'London Open'],
    reasoning: 'Price swept Asian session liquidity then reversed sharply with a strong rejection wick at the session low. Entered on the retest of the now-broken level.',
    psychology: 'Felt calm and patient. Waited for the confirmation candle instead of chasing the initial move.',
    reflection: 'Textbook execution. Patience paid off.',
    whatWentRight: 'Waited for confirmation, set correct stop, scaled out at planned target.',
    whatWentWrong: 'Could have held the runner longer but the partial secured the gain.',
    lesson: 'Patience in London open setups consistently rewards discipline.',
  },
  {
    symbol: 'EURUSD',
    direction: 'SHORT',
    outcome: 'loss',
    rMultiple: -1,
    session: 'New York',
    strategy: 'NY Open Drive',
    hasScreenshot: false,
    entry: 1.0842,
    hour: 13,
    minute: 15,
    daysAgo: 0,
    tags: ['Counter-trend'],
    reasoning: 'Expected a reversal at the daily resistance level. Price had shown some hesitation.',
    psychology: 'Slightly anxious after the morning win. Wanted to keep the momentum going.',
    reflection: 'Should not have taken this. It was against the prevailing trend.',
    whatWentRight: 'Respected the stop loss. Did not move it.',
    whatWentWrong: 'Entered counter-trend without a clear reversal confirmation.',
    lesson: 'Do not trade against the higher timeframe trend without structural confirmation.',
  },
  {
    symbol: 'GBPJPY',
    direction: 'LONG',
    outcome: 'win',
    rMultiple: 1.8,
    session: 'London',
    strategy: 'Trend Pullback',
    hasScreenshot: true,
    entry: 195.42,
    hour: 9,
    minute: 5,
    daysAgo: 1,
    tags: ['Trend', 'London'],
    reasoning: 'Clean pullback to the 20 EMA in a strong uptrend. Bullish engulfing candle confirmed continuation.',
    psychology: 'Confident. This is my bread and butter setup.',
    reflection: 'Good execution. Managed the trade according to plan.',
    whatWentRight: 'Identified the pullback correctly, entered on confirmation.',
    whatWentWrong: 'Exited a bit early on the runner, left some on the table.',
    lesson: 'Trust the trend. Let runners trail further when momentum is strong.',
  },
  {
    symbol: 'US30',
    direction: 'SHORT',
    outcome: 'win',
    rMultiple: 3.1,
    session: 'New York',
    strategy: 'Liquidity Grab',
    hasScreenshot: true,
    entry: 41280,
    hour: 14,
    minute: 30,
    daysAgo: 1,
    tags: ['A+ setup', 'Liquidity'],
    reasoning: 'Price grabbed sell-side liquidity above the NY pre-market range, then reversed with conviction.',
    psychology: 'Very focused. Recognized the trap immediately.',
    reflection: 'One of my best trades this week. Complete setup.',
    whatWentRight: 'Identified the liquidity grab, entered on confirmation, held to target.',
    whatWentWrong: 'Nothing significant. Execution was clean.',
    lesson: 'Liquidity grabs above NY pre-market ranges are high-probability reversals.',
  },
  {
    symbol: 'USDJPY',
    direction: 'LONG',
    outcome: 'breakeven',
    rMultiple: 0.1,
    session: 'Tokyo',
    strategy: 'Range Reversal',
    hasScreenshot: false,
    entry: 149.82,
    hour: 1,
    minute: 20,
    daysAgo: 2,
    tags: ['Range'],
    reasoning: 'Entered at the bottom of the Tokyo range expecting a rotation to the top.',
    psychology: 'Neutral. Not my best session.',
    reflection: 'Price stalled and I managed to scratch the trade.',
    whatWentRight: 'Did not let a marginal trade turn into a loss.',
    whatWentWrong: 'Entered too early in the range before confirmation.',
    lesson: 'Tokyo session ranges require more patience. Wait for the breakout or clear rejection.',
  },
  {
    symbol: 'NAS100',
    direction: 'LONG',
    outcome: 'win',
    rMultiple: 2.0,
    session: 'London/NY Overlap',
    strategy: 'Breakout Retest',
    hasScreenshot: true,
    entry: 17850,
    hour: 10,
    minute: 45,
    daysAgo: 3,
    tags: ['Breakout', 'Overlap'],
    reasoning: 'Broke out of the European session range, pulled back to retest the broken level, and continued.',
    psychology: 'Calm and patient. Followed the plan exactly.',
    reflection: 'Clean breakout retest. Textbook.',
    whatWentRight: 'Waited for the retest, entered on confirmation candle.',
    whatWentWrong: 'Could have sized slightly larger given the quality of the setup.',
    lesson: 'High-quality breakout retests in the overlap session deserve full risk.',
  },
  {
    symbol: 'XAUUSD',
    direction: 'SHORT',
    outcome: 'loss',
    rMultiple: -1,
    session: 'New York',
    strategy: 'NY Open Drive',
    hasScreenshot: false,
    entry: 2521.8,
    hour: 13,
    minute: 45,
    daysAgo: 3,
    tags: ['Revenge'],
    reasoning: 'Entered short after the morning loss to make back the loss quickly.',
    psychology: 'Frustrated. This was a revenge trade.',
    reflection: 'This was a clear rule violation. I traded to recover, not to win.',
    whatWentRight: 'Nothing. The trade was emotionally driven.',
    whatWentWrong: 'Entered without a setup, no structural reason, revenge-driven.',
    lesson: 'Never trade immediately after a loss. Step away from the screens.',
  },
  {
    symbol: 'EURUSD',
    direction: 'LONG',
    outcome: 'win',
    rMultiple: 1.5,
    session: 'London',
    strategy: 'London Sweep',
    hasScreenshot: true,
    entry: 1.0798,
    hour: 8,
    minute: 15,
    daysAgo: 4,
    tags: ['London Open'],
    reasoning: 'Swept Asian low, reversed with momentum. Entered on the retest.',
    psychology: 'Focused and patient.',
    reflection: 'Good start to the day. Set the tone.',
    whatWentRight: 'Correct identification of liquidity sweep, patient entry.',
    whatWentWrong: 'Exited at 1.5R instead of letting it run to 2R.',
    lesson: 'London sweeps often reach 2R+ when momentum is strong on the reversal.',
  },
  {
    symbol: 'BTCUSD',
    direction: 'LONG',
    outcome: 'win',
    rMultiple: 4.2,
    session: 'New York',
    strategy: 'Trend Pullback',
    hasScreenshot: true,
    entry: 58420,
    hour: 15,
    minute: 10,
    daysAgo: 5,
    tags: ['Trend', 'Crypto', 'Big Win'],
    reasoning: 'Strong uptrend, pulled back to the 4H demand zone, bullish pin bar on the 15m.',
    psychology: 'Very confident. The trend was unmistakable.',
    reflection: 'My best trade of the month. Held the runner to the full target.',
    whatWentRight: 'Identified the demand zone, entered on confirmation, held the runner.',
    whatWentWrong: 'Nothing significant.',
    lesson: 'In strong crypto trends, holding runners to structure-based targets maximizes returns.',
  },
  {
    symbol: 'AUDUSD',
    direction: 'SHORT',
    outcome: 'loss',
    rMultiple: -1,
    session: 'Tokyo',
    strategy: 'Range Reversal',
    hasScreenshot: false,
    entry: 0.6542,
    hour: 2,
    minute: 30,
    daysAgo: 6,
    tags: ['Range', 'Overtrading'],
    reasoning: 'Entered short at the top of the range without waiting for confirmation.',
    psychology: 'Bored. Traded for entertainment.',
    reflection: 'No reason to be in this trade. Overtrading in a slow session.',
    whatWentRight: 'Respected the stop.',
    whatWentWrong: 'No setup, no confirmation, traded out of boredom.',
    lesson: 'Do not trade Tokyo session ranges without a clear breakout or rejection plan.',
  },
  {
    symbol: 'GBPJPY',
    direction: 'SHORT',
    outcome: 'win',
    rMultiple: 2.1,
    session: 'London',
    strategy: 'Liquidity Grab',
    hasScreenshot: true,
    entry: 196.15,
    hour: 9,
    minute: 30,
    daysAgo: 7,
    tags: ['Liquidity', 'London'],
    reasoning: 'Buy-side liquidity grab above the Asian high, then sharp reversal.',
    psychology: 'Calm and focused.',
    reflection: 'Great patience waiting for the grab and the confirmation.',
    whatWentRight: 'Patient entry, correct target, clean management.',
    whatWentWrong: 'Nothing significant.',
    lesson: 'London liquidity grabs are one of my strongest edges.',
  },
  {
    symbol: 'XAUUSD',
    direction: 'LONG',
    outcome: 'win',
    rMultiple: 1.6,
    session: 'London/NY Overlap',
    strategy: 'Breakout Retest',
    hasScreenshot: false,
    entry: 2498.5,
    hour: 11,
    minute: 20,
    daysAgo: 8,
    tags: ['Breakout', 'Overlap'],
    reasoning: 'Broke Asian range high, retested, continued into the overlap.',
    psychology: 'Confident.',
    reflection: 'Solid execution.',
    whatWentRight: 'Correct breakout identification.',
    whatWentWrong: 'Could have held longer.',
    lesson: 'Overlap breakouts tend to extend further than I expect.',
  },
  {
    symbol: 'US30',
    direction: 'LONG',
    outcome: 'loss',
    rMultiple: -0.5,
    session: 'New York',
    strategy: 'NY Open Drive',
    hasScreenshot: false,
    entry: 41050,
    hour: 14,
    minute: 5,
    daysAgo: 9,
    tags: ['Early Entry'],
    reasoning: 'Entered before the NY open confirmation. Price reversed and stopped me out.',
    psychology: 'Anxious. Entered early because I did not want to miss the move.',
    reflection: 'Impatience cost me. Should have waited for the open.',
    whatWentRight: 'Cut the trade early before full stop.',
    whatWentWrong: 'Entered before confirmation.',
    lesson: 'Always wait for the NY open candle to confirm direction.',
  },
  {
    symbol: 'EURUSD',
    direction: 'SHORT',
    outcome: 'win',
    rMultiple: 2.8,
    session: 'London',
    strategy: 'London Sweep',
    hasScreenshot: true,
    entry: 1.0895,
    hour: 8,
    minute: 45,
    daysAgo: 10,
    tags: ['A+ setup', 'London'],
    reasoning: 'Swept Asian high, sharp rejection, entered on retest.',
    psychology: 'Very calm. Best setup of the week.',
    reflection: 'Textbook London sweep. Full conviction.',
    whatWentRight: 'Perfect entry, perfect target, perfect management.',
    whatWentWrong: 'Nothing.',
    lesson: 'When the setup is A+, do not hesitate on position size within plan.',
  },
  {
    symbol: 'USDJPY',
    direction: 'LONG',
    outcome: 'win',
    rMultiple: 1.3,
    session: 'Tokyo',
    strategy: 'Trend Pullback',
    hasScreenshot: false,
    entry: 150.12,
    hour: 3,
    minute: 15,
    daysAgo: 12,
    tags: ['Tokyo', 'Trend'],
    reasoning: 'Pullback to the Tokyo open level in an uptrend.',
    psychology: 'Cautious. Tokyo is not my best session.',
    reflection: 'Managed well for a session I am not comfortable in.',
    whatWentRight: 'Identified the pullback level correctly.',
    whatWentWrong: 'Exited early due to discomfort with the session.',
    lesson: 'Trust the setup regardless of session bias.',
  },
  {
    symbol: 'NAS100',
    direction: 'SHORT',
    outcome: 'loss',
    rMultiple: -1,
    session: 'New York',
    strategy: 'Liquidity Grab',
    hasScreenshot: false,
    entry: 17920,
    hour: 15,
    minute: 30,
    daysAgo: 14,
    tags: ['Late Entry'],
    reasoning: 'Entered late on a liquidity grab that had already completed. Chased the move.',
    psychology: 'FOMO. Did not want to miss the move.',
    reflection: 'Chased a move that was already done. Classic FOMO.',
    whatWentRight: 'Respected the stop.',
    whatWentWrong: 'Entered after the move was complete. FOMO.',
    lesson: 'If the entry is missed, let it go. There is always another setup.',
  },
];

const baseRiskPerTrade = 25;

export const trades: Trade[] = tradeTemplates.map((t, i) => {
  const isLong = t.direction === 'LONG';
  const stopDistance = t.entry * 0.002;
  const stopLoss = isLong ? t.entry - stopDistance : t.entry + stopDistance;
  const takeProfit = isLong ? t.entry + stopDistance * Math.abs(t.rMultiple) : t.entry - stopDistance * Math.abs(t.rMultiple);
  const pnl = Math.round(baseRiskPerTrade * t.rMultiple * 100) / 100;
  const exit = isLong ? t.entry + stopDistance * (t.rMultiple >= 0 ? t.rMultiple : 1) : t.entry - stopDistance * (t.rMultiple >= 0 ? t.rMultiple : 1);

  return {
    id: `trade-${i + 1}`,
    symbol: t.symbol,
    direction: t.direction,
    outcome: t.outcome,
    pnl,
    rMultiple: t.rMultiple,
    entry: t.entry,
    exit: Math.round(exit * 100) / 100,
    stopLoss: Math.round(stopLoss * 100) / 100,
    takeProfit: Math.round(takeProfit * 100) / 100,
    positionSize: Math.round((baseRiskPerTrade / stopDistance) * 100) / 100,
    risk: baseRiskPerTrade,
    reward: Math.round(baseRiskPerTrade * Math.abs(t.rMultiple) * 100) / 100,
    session: t.session,
    date: dateOffset(t.daysAgo, t.hour, t.minute),
    strategy: t.strategy,
    tags: t.tags,
    hasScreenshot: t.hasScreenshot,
    reasoning: t.reasoning,
    psychology: t.psychology,
    reflection: t.reflection,
    whatWentRight: t.whatWentRight,
    whatWentWrong: t.whatWentWrong,
    lesson: t.lesson,
  };
});

export const equityCurve: EquityPoint[] = (() => {
  const points: EquityPoint[] = [];
  let equity = 2500;
  const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  points.push({ date: dateOffset(30), equity: 2500, startingBalance: 2500 });
  for (const trade of sorted) {
    equity += trade.pnl;
    points.push({ date: trade.date, equity: Math.round(equity * 100) / 100, startingBalance: 2500 });
  }
  return points;
})();

export const calendarData: CalendarDay[] = (() => {
  const days: CalendarDay[] = [];
  const today = new Date(2026, 7, 27);
  const year = today.getFullYear();
  const month = today.getMonth();
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
})();

export function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000) {
    return '$' + (value / 1000).toFixed(1) + 'K';
  }
  const sign = value >= 0 ? '' : '-';
  return `${sign}$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatR(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}R`;
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }): string {
  return new Date(iso).toLocaleDateString('en-US', opts);
}

export function formatRelativeDate(iso: string): string {
  const now = new Date(2026, 7, 27, 23, 59);
  const d = new Date(iso);
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(iso);
}

export const dashboardStats = {
  netPnl: trades.reduce((sum, t) => sum + t.pnl, 0),
  winRate: (trades.filter((t) => t.outcome === 'win').length / trades.length) * 100,
  totalTrades: trades.length,
  avgR: trades.reduce((sum, t) => sum + t.rMultiple, 0) / trades.length,
  wins: trades.filter((t) => t.outcome === 'win').length,
  losses: trades.filter((t) => t.outcome === 'loss').length,
  breakevens: trades.filter((t) => t.outcome === 'breakeven').length,
  bestTrade: trades.reduce((best, t) => (t.rMultiple > best.rMultiple ? t : best), trades[0]),
  worstTrade: trades.reduce((worst, t) => (t.rMultiple < worst.rMultiple ? t : worst), trades[0]),
  todayPnl: trades.filter((t) => new Date(t.date).toDateString() === new Date(2026, 7, 27).toDateString()).reduce((sum, t) => sum + t.pnl, 0),
};

export const insights: Insight[] = [
  {
    id: 'insight-1',
    type: 'pattern',
    label: 'Pattern Detected',
    title: 'Performance declines after two consecutive trades',
    description: 'Your win rate drops by 38% on your third trade of the day. After two trades, discipline and pattern recognition appear to weaken.',
    metric: 'Win Rate Drop',
    value: '-38%',
  },
  {
    id: 'insight-2',
    type: 'edge',
    label: 'Strongest Edge',
    title: 'London session — 64% win rate',
    description: 'Your London open trades show a significantly higher win rate and average R compared to other sessions. This is your clearest statistical edge.',
    metric: 'London Win Rate',
    value: '64%',
    rMultiple: 14.2,
  },
  {
    id: 'insight-3',
    type: 'weakness',
    label: 'Biggest Weakness',
    title: 'Overtrading after losses',
    description: 'In 3 of your 4 losing streaks, the trade immediately following a loss was entered without a valid setup. 2 of these were tagged as revenge trades.',
    metric: 'Revenge Trade Rate',
    value: '75%',
  },
  {
    id: 'insight-4',
    type: 'pattern',
    label: 'Pattern Detected',
    title: 'Tuesday is your most profitable day',
    description: 'Tuesdays account for 42% of your total profit this month, with an average of +2.1R per session.',
    metric: 'Tuesday Avg',
    value: '+2.1R',
  },
  {
    id: 'insight-5',
    type: 'edge',
    label: 'Strongest Edge',
    title: 'London Sweep is your highest-R strategy',
    description: 'Your London Sweep setups average 2.3R per trade, significantly above your overall average of 1.1R.',
    metric: 'Strategy Avg R',
    value: '2.3R',
    rMultiple: 9.2,
  },
];

export const truthInsights = [
  {
    label: 'Your Best Edge',
    title: 'London Sweep',
    value: '+18.4R',
    description: 'Your London liquidity sweep setups are your most consistent and highest-R edge.',
  },
  {
    label: 'Your Worst Habit',
    title: 'Overtrading',
    value: '-12.1R',
    description: 'Trades taken without a valid setup, primarily after losses, have cost you 12.1R this month.',
  },
  {
    label: 'Your Most Expensive Mistake',
    title: 'Moving Stop Loss',
    value: '-8.3R',
    description: 'In the 4 instances where you moved your stop loss, every trade eventually hit the widened stop.',
  },
];

export const tradingDNA = {
  bestPair: { name: 'XAUUSD', value: '+8.4R', winRate: '67%' },
  bestSession: { name: 'London', value: '64%', winRate: '64%' },
  bestStrategy: { name: 'London Sweep', value: '+9.2R', winRate: '71%' },
  disciplineScore: { value: '72', label: 'Good' },
  primaryWeakness: { name: 'Overtrading', value: '-12.1R' },
  emotionalTrigger: { name: 'Loss Aversion', value: 'FOMO after wins' },
};

export const replayEvents: ReplayEvent[] = [
  { time: '08:32', label: 'Trade opened', detail: 'XAUUSD Long @ 2512.4 — London Sweep', type: 'open' },
  { time: '09:15', label: 'Moved stop to breakeven', detail: 'Price reached 1R, stop moved to entry', type: 'note' },
  { time: '10:14', label: 'Partial profit', detail: '50% closed @ 2517.2 (+1.2R on half)', type: 'partial', rMultiple: 0.6 },
  { time: '10:47', label: 'Trade closed', detail: 'Runner closed @ 2522.8 (+2.4R)', type: 'close', rMultiple: 1.8 },
  { time: '13:15', label: 'Trade opened', detail: 'EURUSD Short @ 1.0842 — Counter-trend', type: 'open' },
  { time: '14:02', label: 'Trade closed', detail: 'Stopped out @ 1.0852 (-1R)', type: 'close', rMultiple: -1 },
  { time: '14:45', label: 'Trade opened', detail: 'GBPJPY Long @ 195.42 — Trend Pullback', type: 'open' },
  { time: '16:20', label: 'Trade closed', detail: 'Target hit @ 196.15 (+1.8R)', type: 'close', rMultiple: 1.8 },
];
