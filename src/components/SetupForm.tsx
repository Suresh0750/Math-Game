import type { PracticeType, QuestionOrder, TimerMode } from '../types';
import { OptionGroup } from './NavBar';
import { Input } from './Input';

interface CommonSetupOptionsProps {
  order: QuestionOrder;
  onOrderChange: (order: QuestionOrder) => void;
  timerMode: TimerMode;
  onTimerModeChange: (mode: TimerMode) => void;
  customTimerSeconds: number;
  onCustomTimerChange: (seconds: number) => void;
}

export function CommonSetupOptions({
  order,
  onOrderChange,
  timerMode,
  onTimerModeChange,
  customTimerSeconds,
  onCustomTimerChange,
}: CommonSetupOptionsProps) {
  return (
    <div className="space-y-6">
      <OptionGroup
        label="Question Order"
        value={order}
        onChange={onOrderChange}
        options={[
          { value: 'sequential' as QuestionOrder, label: 'Sequential' },
          { value: 'random' as QuestionOrder, label: 'Random' },
        ]}
      />

      <OptionGroup
        label="Timer"
        value={timerMode}
        onChange={onTimerModeChange}
        options={[
          { value: 'none' as TimerMode, label: 'No Timer' },
          { value: '5' as TimerMode, label: '5 sec' },
          { value: '10' as TimerMode, label: '10 sec' },
          { value: 'custom' as TimerMode, label: 'Custom' },
        ]}
      />

      {timerMode === 'custom' && (
        <Input
          label="Custom timer (seconds per question)"
          type="number"
          min={3}
          max={120}
          value={customTimerSeconds}
          onChange={(e) => onCustomTimerChange(Number(e.target.value) || 15)}
        />
      )}
    </div>
  );
}

interface RangeSelectorProps {
  presets: { label: string; start: number; end: number }[];
  rangeStart: number;
  rangeEnd: number;
  onRangeChange: (start: number, end: number) => void;
  customMode: boolean;
  onCustomModeChange: (custom: boolean) => void;
}

export function RangeSelector({
  presets,
  rangeStart,
  rangeEnd,
  onRangeChange,
  customMode,
  onCustomModeChange,
}: RangeSelectorProps) {
  const activePreset = presets.find((p) => p.start === rangeStart && p.end === rangeEnd);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Practice Range
      </h3>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              onCustomModeChange(false);
              onRangeChange(preset.start, preset.end);
            }}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
              !customMode && activePreset?.label === preset.label
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200',
            ].join(' ')}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onCustomModeChange(true)}
          className={[
            'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
            customMode
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200',
          ].join(' ')}
        >
          Custom
        </button>
      </div>

      {customMode && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Input
            label="From"
            type="number"
            min={1}
            value={rangeStart}
            onChange={(e) => onRangeChange(Number(e.target.value) || 1, rangeEnd)}
          />
          <Input
            label="To"
            type="number"
            min={rangeStart}
            value={rangeEnd}
            onChange={(e) => onRangeChange(rangeStart, Number(e.target.value) || rangeStart)}
          />
        </div>
      )}

      <p className="mt-2 text-sm text-slate-500">
        {rangeEnd - rangeStart + 1} questions total
      </p>
    </div>
  );
}

export function getPracticeTypeLabel(type: PracticeType): string {
  switch (type) {
    case 'multiplication':
      return 'Multiplication Tables';
    case 'squares':
      return 'Squares';
    case 'cubes':
      return 'Cubes';
    case 'weak':
      return 'Weak Questions';
  }
}
