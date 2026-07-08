import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/Button';
import { ScorePanel } from '../components/ScorePanel';
import { TimerDisplay } from '../components/TimerDisplay';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { usePractice } from '../context/PracticeContext';
import type { AnswerRecord } from '../types';
import { getPracticeTitle, getTimerSeconds } from '../utils/questions';
import { parseAnswer } from '../utils/helpers';
import { useTimer } from '../hooks/useTimer';

type Phase = 'answering' | 'feedback';

export function PracticePage() {
  const navigate = useNavigate();
  const { session, updateSession, setCompletedSession, startSession, endSession } = usePractice();

  const [currentIndex, setCurrentIndex] = useState(() => session?.answers.length ?? 0);
  const [inputValue, setInputValue] = useState('');
  const [phase, setPhase] = useState<Phase>('answering');
  const [currentRecord, setCurrentRecord] = useState<AnswerRecord | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const questions = session?.questions ?? [];
  const timerSeconds = session ? getTimerSeconds(session.config) : null;
  const timerActive = phase === 'answering' && timerSeconds != null;

  const answeredCount = session?.answers.length ?? 0;
  const correctCount = session?.answers.filter((a) => a.correct).length ?? 0;
  const wrongCount = answeredCount - correctCount;
  const remaining = questions.length - answeredCount;

  const currentQuestion = questions[currentIndex];

  const finishSession = useCallback(() => {
    if (!session) return;
    const completed = { ...session, completedAt: Date.now() };
    setCompletedSession(completed);
    endSession();
    navigate('/results');
  }, [session, setCompletedSession, endSession, navigate]);

  const goToNext = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      finishSession();
      return;
    }

    setCurrentIndex(nextIndex);
    setPhase('answering');
    setCurrentRecord(null);
    setInputValue('');
  }, [currentIndex, questions.length, finishSession]);

  const recordAnswer = useCallback(
    (userAnswer: number | null, timeUp = false) => {
      if (!session || !currentQuestion || phase !== 'answering') return;

      const correct =
        !timeUp && userAnswer != null && userAnswer === currentQuestion.correctAnswer;

      const record: AnswerRecord = {
        question: currentQuestion,
        userAnswer: timeUp ? null : userAnswer,
        correct,
        timeUp,
      };

      const updated = {
        ...session,
        answers: [...session.answers, record],
      };
      updateSession(updated);
      setCurrentRecord(record);
      setPhase('feedback');

      if (correct) {
        autoAdvanceRef.current = setTimeout(goToNext, 700);
      }
    },
    [session, currentQuestion, phase, updateSession, goToNext]
  );

  const handleSubmit = useCallback(() => {
    const answer = parseAnswer(inputValue);
    if (answer == null) return;
    recordAnswer(answer);
  }, [inputValue, recordAnswer]);

  const handleTimeUp = useCallback(() => {
    recordAnswer(null, true);
  }, [recordAnswer]);

  const { remaining: timerRemaining, progress, reset: resetTimer } = useTimer(
    timerSeconds,
    timerActive,
    handleTimeUp
  );

  useEffect(() => {
    if (phase === 'answering') {
      resetTimer();
      inputRef.current?.focus();
    }
  }, [currentIndex, phase, resetTimer]);

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }
    if (session.answers.length >= session.questions.length) {
      finishSession();
    }
  }, [session, navigate, finishSession]);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (phase === 'answering') {
          handleSubmit();
        } else {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleSubmit, goToNext, currentIndex]);

  const handleRestart = () => {
    if (!session) return;
    if (window.confirm('Restart this practice session? Progress will be lost.')) {
      startSession(session.config);
      setCurrentIndex(0);
      setInputValue('');
      setPhase('answering');
      setCurrentRecord(null);
    }
  };

  if (!session || !currentQuestion) return null;

  const displayIndex = currentIndex + 1;

  return (
    <Layout
      title={getPracticeTitle(session.config)}
      subtitle={`Question ${displayIndex} of ${questions.length}`}
    >
      <NavBar
        onHome={() => navigate('/')}
        showBack={false}
        showRestart
        onRestart={handleRestart}
      />

      <div className="flex flex-1 flex-col gap-6">
        <ScorePanel
          correct={correctCount}
          wrong={wrongCount}
          remaining={remaining}
          total={questions.length}
        />

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <TimerDisplay
              remaining={timerRemaining}
              progress={progress}
              active={timerActive}
            />

            <div className="mb-6 text-center">
              <p className="text-sm font-medium text-slate-400">
                Question {displayIndex} of {questions.length}
              </p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {currentQuestion.display}{' '}
                <span className="text-indigo-400">=</span>
              </p>
            </div>

            {phase === 'answering' ? (
              <div className="space-y-4">
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Your answer"
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-4 text-center text-2xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  autoComplete="off"
                />
                <Button fullWidth onClick={handleSubmit} disabled={inputValue.trim() === ''}>
                  Submit <span className="text-xs opacity-70">(Enter)</span>
                </Button>
              </div>
            ) : (
              currentRecord && (
                <FeedbackPanel record={currentRecord} onContinue={goToNext} />
              )
            )}
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Press Enter to submit or continue
        </div>
      </div>
    </Layout>
  );
}
