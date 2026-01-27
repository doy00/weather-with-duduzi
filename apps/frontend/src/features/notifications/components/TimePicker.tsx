import type React from 'react';

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  disabled?: boolean;
}

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value + ':00');
  };

  const displayValue = value ? value.substring(0, 5) : '';

  return (
    <input
      type="time"
      value={displayValue}
      onChange={handleTimeChange}
      disabled={disabled}
      className="glass px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    />
  );
}
