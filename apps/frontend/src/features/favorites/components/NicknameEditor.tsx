import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface NicknameEditorProps {
  initialValue: string;
  onSave: (nickname: string) => void;
  onCancel: () => void;
}

export const NicknameEditor: React.FC<NicknameEditorProps> = ({
  initialValue,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation('common');
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      onSave(value);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      onCancel();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        autoFocus
        className="bg-white/20 rounded-lg px-2 py-1 text-sm outline-none border border-white/40 text-white"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        aria-label={t('favorites.ariaLabel.input')}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSave(value);
        }}
        className="text-[10px] font-bold bg-white/40 rounded-md py-1"
        aria-label={t('favorites.ariaLabel.save')}
      >
        {t('favorites.complete')}
      </button>
    </div>
  );
};
