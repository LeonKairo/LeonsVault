import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { CheckInCause, CheckInFeeling, SessionCheckIn } from '@/types';

export const COOLDOWN_MS = 30 * 60 * 1000;
export const HARD_BLOCK_MS = 5 * 60 * 60 * 1000;

const SESSION_KEY = 'vault-session-active';

const VAULT_MESSAGES: Record<CheckInCause, string> = {
  physical: "Your body isn't in a state to execute cleanly. The market will still be here tomorrow. Sit this one out.",
  personal_stress: "This isn't about the chart. Trading won't fix what's actually bothering you today.",
  post_loss: "A loss fresh in your mind clouds the next decision. Take a moment before you re-engage.",
  fomo: "Wanting a trade isn't the same as having a setup. No trade yet.",
  other: "Noted. Just checking in with yourself before you check in with the market.",
};

export type SessionStatus = 'cleared' | 'hard_block' | 'cooldown' | 'soft_warning';

interface SessionCheckInValue {
  loading: boolean;
  checkIn: SessionCheckIn | null;
  status: SessionStatus;
  blocked: boolean;
  blockUntil: Date | null;
  sessionActive: boolean;
  checkInPending: boolean;
  startSession: () => void;
  cancelCheckIn: () => void;
  submitCheckIn: (feeling: CheckInFeeling, cause?: CheckInCause) => Promise<void>;
  acknowledge: () => Promise<void>;
  refetch: () => Promise<void>;
}

const SessionCheckInContext = createContext<SessionCheckInValue | undefined>(undefined);

export function SessionCheckInProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<SessionCheckIn | null>(null);
  const [checkInPending, setCheckInPending] = useState(false);

  const sessionActive = (() => {
    try {
      return localStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  })();

  const setSessionActive = useCallback((value: boolean) => {
    try {
      if (value) {
        localStorage.setItem(SESSION_KEY, 'true');
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const fetchLatest = useCallback(async () => {
    const { data, error } = await supabase
      .from('session_checkins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setLoading(false);
      return;
    }
    setCheckIn(data as SessionCheckIn | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  const startSession = useCallback(() => {
    setCheckInPending(true);
  }, []);

  const cancelCheckIn = useCallback(() => {
    setCheckInPending(false);
  }, []);

  const submitCheckIn = useCallback(
    async (feeling: CheckInFeeling, cause?: CheckInCause) => {
      let action: SessionCheckIn['action'] = 'cleared';
      let blockUntil: string | null = null;
      let message: string | null = null;

      if (feeling === 'calm') {
        action = 'cleared';
      } else if (cause) {
        message = VAULT_MESSAGES[cause];
        if (cause === 'physical' || cause === 'personal_stress') {
          action = 'hard_block';
          blockUntil = new Date(Date.now() + HARD_BLOCK_MS).toISOString();
        } else if (cause === 'post_loss') {
          action = 'cooldown';
          blockUntil = new Date(Date.now() + COOLDOWN_MS).toISOString();
        } else {
          action = 'soft_warning';
        }
      }

      const { data, error } = await supabase
        .from('session_checkins')
        .insert({
          feeling,
          cause: cause ?? null,
          action,
          block_until: blockUntil,
          acknowledged: false,
          message,
        })
        .select('*')
        .single();

      if (error) return;
      setCheckIn(data as SessionCheckIn);
      setCheckInPending(false);
      setSessionActive(true);
    },
    [setSessionActive],
  );

  const acknowledge = useCallback(async () => {
    if (!checkIn) return;
    const { data, error } = await supabase
      .from('session_checkins')
      .update({ acknowledged: true })
      .eq('id', checkIn.id)
      .select('*')
      .single();
    if (error) return;
    setCheckIn(data as SessionCheckIn);
    setSessionActive(true);
  }, [checkIn, setSessionActive]);

  const now = Date.now();
  let status: SessionStatus = 'cleared';
  let blocked = false;
  let blockUntilDate: Date | null = null;

  if (checkIn) {
    if (checkIn.action === 'hard_block' || checkIn.action === 'cooldown') {
      const until = checkIn.block_until ? new Date(checkIn.block_until).getTime() : 0;
      if (until > now) {
        status = checkIn.action;
        blocked = true;
        blockUntilDate = new Date(until);
      } else {
        status = 'cleared';
      }
    } else if (checkIn.action === 'soft_warning' && !checkIn.acknowledged) {
      status = 'soft_warning';
    }
  }

  return (
    <SessionCheckInContext.Provider
      value={{
        loading,
        checkIn,
        status,
        blocked,
        blockUntil: blockUntilDate,
        sessionActive,
        checkInPending,
        startSession,
        cancelCheckIn,
        submitCheckIn,
        acknowledge,
        refetch: fetchLatest,
      }}
    >
      {children}
    </SessionCheckInContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSessionCheckIn() {
  const ctx = useContext(SessionCheckInContext);
  if (!ctx) throw new Error('useSessionCheckIn must be used within SessionCheckInProvider');
  return ctx;
}
