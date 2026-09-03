export type Direction = 'LONG' | 'SHORT';
export type TradeOutcome = 'win' | 'loss' | 'breakeven';
export type Session = 'London' | 'New York' | 'Tokyo' | 'Sydney' | 'London/NY Overlap';
export type TradingDayStatus = 'positive' | 'negative' | 'neutral' | 'no-trade';

export interface Trade {
  id: string;
  symbol: string;
  direction: Direction;
  outcome: TradeOutcome;
  pnl: number;
  rMultiple: number;
  entry: number;
  exit: number;
  stopLoss: number;
  takeProfit: number;
  positionSize: number;
  risk: number;
  reward: number;
  session: Session;
  date: string;
  strategy: string;
  tags: string[];
  hasScreenshot: boolean;
  reasoning: string;
  psychology: string;
  reflection: string;
  whatWentRight: string;
  whatWentWrong: string;
  lesson: string;
}

export interface EquityPoint {
  date: string;
  equity: number;
  startingBalance: number;
}

export interface CalendarDay {
  date: string;
  day: number;
  status: TradingDayStatus;
  pnl: number;
  rMultiple: number;
  trades: number;
  isCurrentMonth: boolean;
}

export interface TradingAccount {
  id: string;
  name: string;
  broker: string;
  balance: number;
  equity: number;
  type: 'Evaluation' | 'Funded' | 'Live' | 'Demo';
  currency: string;
  color: string;
}

export interface DebriefState {
  dayRating: 'Good' | 'Perfect' | 'Bad' | 'Ugly' | null;
  followedPlan: 'Yes' | 'Mostly' | 'No' | null;
  factors: string[];
  reflection: string;
  sealed: boolean;
}

export interface Insight {
  id: string;
  type: 'pattern' | 'edge' | 'weakness' | 'truth';
  label: string;
  title: string;
  description: string;
  metric?: string;
  value?: string;
  rMultiple?: number;
}

export interface ReplayEvent {
  time: string;
  label: string;
  detail: string;
  type: 'open' | 'partial' | 'close' | 'note';
  rMultiple?: number;
}

export type CheckInFeeling = 'calm' | 'off' | 'stressed' | 'exhausted';
export type CheckInCause = 'physical' | 'personal_stress' | 'post_loss' | 'fomo' | 'other';
export type CheckInAction = 'cleared' | 'hard_block' | 'cooldown' | 'soft_warning';

export interface SessionCheckIn {
  id: string;
  feeling: CheckInFeeling;
  cause: CheckInCause | null;
  action: CheckInAction;
  block_until: string | null;
  acknowledged: boolean;
  created_at: string;
  message: string | null;
}
