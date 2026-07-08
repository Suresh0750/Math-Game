import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { PracticeConfig, PracticeSession } from '../types';
import { generateQuestions } from '../utils/questions';
import { clearActiveSession, loadActiveSession, saveActiveSession } from '../utils/storage';

interface PracticeContextValue {
  session: PracticeSession | null;
  startSession: (config: PracticeConfig) => void;
  updateSession: (session: PracticeSession) => void;
  endSession: () => void;
  completedSession: PracticeSession | null;
  setCompletedSession: (session: PracticeSession | null) => void;
}

const PracticeContext = createContext<PracticeContextValue | null>(null);

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PracticeSession | null>(() => loadActiveSession());
  const [completedSession, setCompletedSession] = useState<PracticeSession | null>(null);

  const startSession = useCallback((config: PracticeConfig) => {
    const newSession: PracticeSession = {
      config,
      questions: generateQuestions(config),
      answers: [],
      startedAt: Date.now(),
    };
    setSession(newSession);
    saveActiveSession(newSession);
    setCompletedSession(null);
  }, []);

  const updateSession = useCallback((updated: PracticeSession) => {
    setSession(updated);
    saveActiveSession(updated);
  }, []);

  const endSession = useCallback(() => {
    setSession(null);
    clearActiveSession();
  }, []);

  const value = useMemo(
    () => ({
      session,
      startSession,
      updateSession,
      endSession,
      completedSession,
      setCompletedSession,
    }),
    [session, startSession, updateSession, endSession, completedSession]
  );

  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>;
}

export function usePractice() {
  const ctx = useContext(PracticeContext);
  if (!ctx) throw new Error('usePractice must be used within PracticeProvider');
  return ctx;
}
