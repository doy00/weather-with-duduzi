interface DaySelectorProps {
  value?: number[];
  onChange: (days: number[]) => void;
  disabled?: boolean;
}

const DAYS = [
  { label: '일', value: 0 },
  { label: '월', value: 1 },
  { label: '화', value: 2 },
  { label: '수', value: 3 },
  { label: '목', value: 4 },
  { label: '금', value: 5 },
  { label: '토', value: 6 },
];

const PRESETS = {
  weekdays: [1, 2, 3, 4, 5],
  weekend: [0, 6],
  everyday: [0, 1, 2, 3, 4, 5, 6],
};

export function DaySelector({ value = [], onChange, disabled }: DaySelectorProps) {
  const toggleDay = (day: number) => {
    if (disabled) return;

    if (value.includes(day)) {
      onChange(value.filter(d => d !== day));
    } else {
      onChange([...value, day].sort());
    }
  };

  const setPreset = (preset: number[]) => {
    if (disabled) return;
    onChange(preset);
  };

  return (
    <div className="space-y-3">
      {/* 요일 선택 */}
      <div className="flex gap-2">
        {DAYS.map(day => (
          <button
            key={day.value}
            onClick={() => toggleDay(day.value)}
            disabled={disabled}
            className={`
              glass px-3 py-2 rounded-lg font-medium transition
              ${value.includes(day.value) ? 'bg-blue-500/30 ring-2 ring-blue-500' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
            `}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* 프리셋 버튼 */}
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setPreset(PRESETS.weekdays)}
          disabled={disabled}
          className="glass px-3 py-1 rounded-lg hover:opacity-80 transition disabled:opacity-50"
        >
          평일
        </button>
        <button
          onClick={() => setPreset(PRESETS.weekend)}
          disabled={disabled}
          className="glass px-3 py-1 rounded-lg hover:opacity-80 transition disabled:opacity-50"
        >
          주말
        </button>
        <button
          onClick={() => setPreset(PRESETS.everyday)}
          disabled={disabled}
          className="glass px-3 py-1 rounded-lg hover:opacity-80 transition disabled:opacity-50"
        >
          매일
        </button>
      </div>
    </div>
  );
}
