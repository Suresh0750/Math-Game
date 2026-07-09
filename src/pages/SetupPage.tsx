import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { CommonSetupOptions, RangeSelector, getPracticeTypeLabel } from '../components/SetupForm';
import { usePractice } from '../context/PracticeContext';
import type { PracticeType, QuestionOrder, TimerMode } from '../types';
import { PRESET_TABLES, RANGE_PRESETS } from '../types';
import { loadStats, savePreferences } from '../utils/storage';

export function SetupPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { startSession } = usePractice();
  const stats = loadStats();

  const practiceType = (type ?? 'multiplication') as PracticeType;
  const isMultiplication = practiceType === 'multiplication';

  const [selectedTables, setSelectedTables] = useState<number[]>(() => {
    if (stats.lastTables?.length) return stats.lastTables;
    return stats.lastTable ? [stats.lastTable] : [8];
  });
  const [customTable, setCustomTable] = useState('');
  const [customTableMode, setCustomTableMode] = useState(() => {
    const lastT = stats.lastTable ?? 8;
    return !PRESET_TABLES.includes(lastT);
  });
  const [rangeStart, setRangeStart] = useState(stats.lastRangeStart);
  const [rangeEnd, setRangeEnd] = useState(stats.lastRangeEnd);
  const [customRange, setCustomRange] = useState(false);
  const [order, setOrder] = useState<QuestionOrder>(stats.lastOrder);
  const [timerMode, setTimerMode] = useState<TimerMode>(stats.lastTimerMode);
  const [customTimerSeconds, setCustomTimerSeconds] = useState(stats.lastCustomTimerSeconds);

  const presets = RANGE_PRESETS[practiceType === 'multiplication' ? 'multiplication' : practiceType];
  const selectedTable = customTableMode ? Number(customTable) || 8 : selectedTables[0];
  const totalQuestions = (rangeEnd - rangeStart + 1) * (customTableMode ? 1 : selectedTables.length);

  const handleStart = () => {
    const config = {
      type: practiceType,
      table: isMultiplication && customTableMode ? selectedTable : undefined,
      tables: isMultiplication && !customTableMode ? selectedTables : undefined,
      rangeStart,
      rangeEnd,
      order,
      timerMode,
      customTimerSeconds,
    };

    savePreferences({
      lastPracticeType: practiceType,
      lastTable: isMultiplication ? (customTableMode ? selectedTable : selectedTables[0]) : null,
      lastTables: isMultiplication && !customTableMode ? selectedTables : [],
      lastRangeStart: rangeStart,
      lastRangeEnd: rangeEnd,
      lastOrder: order,
      lastTimerMode: timerMode,
      lastCustomTimerSeconds: customTimerSeconds,
    });

    startSession(config);
    navigate('/practice');
  };

  return (
    <Layout title={getPracticeTypeLabel(practiceType)} subtitle="Configure your practice session">
      <NavBar onHome={() => navigate('/')} onBack={() => navigate('/')} />

      <div className="flex flex-1 flex-col gap-8">
        {isMultiplication && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Select Table(s)
              </h3>
              {!customTableMode && (
                <span className="text-xs text-indigo-500 font-medium">
                  Select multiple to practice them together!
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_TABLES.map((t) => {
                const isSelected = !customTableMode && selectedTables.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setCustomTableMode(false);
                      setSelectedTables((prev) => {
                        if (prev.includes(t)) {
                          if (prev.length === 1) return prev; // Keep at least one selected
                          return prev.filter((x) => x !== t);
                        } else {
                          return [...prev, t];
                        }
                      });
                    }}
                    className={[
                      'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200',
                    ].join(' ')}
                  >
                    Table {t}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setCustomTableMode(true)}
                className={[
                  'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                  customTableMode
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200',
                ].join(' ')}
              >
                Custom
              </button>
            </div>
            {customTableMode && (
              <div className="mt-4 max-w-xs">
                <Input
                  label="Enter table number"
                  type="number"
                  min={1}
                  max={100}
                  value={customTable}
                  onChange={(e) => setCustomTable(e.target.value)}
                  placeholder="e.g. 15"
                />
              </div>
            )}
          </div>
        )}

        <RangeSelector
          presets={presets}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onRangeChange={(start, end) => {
            setRangeStart(start);
            setRangeEnd(end);
          }}
          customMode={customRange}
          onCustomModeChange={setCustomRange}
        />

        <CommonSetupOptions
          order={order}
          onOrderChange={setOrder}
          timerMode={timerMode}
          onTimerModeChange={setTimerMode}
          customTimerSeconds={customTimerSeconds}
          onCustomTimerChange={setCustomTimerSeconds}
        />

        <div className="mt-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-4 text-center text-sm text-slate-600">
            Ready to practice{' '}
            <span className="font-bold text-slate-900">
              {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
            </span>
            {isMultiplication && (
              <>
                {' '}
                from Table{customTableMode ? '' : selectedTables.length > 1 ? 's' : ''}{' '}
                <span className="font-bold text-indigo-600">
                  {customTableMode ? selectedTable : selectedTables.join(', ')}
                </span>
              </>
            )}
          </p>
          <Button
            fullWidth
            onClick={handleStart}
            disabled={totalQuestions <= 0 || (isMultiplication && customTableMode && selectedTable < 1)}
          >
            Start Practice →
          </Button>
        </div>
      </div>
    </Layout>
  );
}
