import { useState } from 'react';
import type { FavoriteLocation } from '@/features/favorites/types/favorite.types';
import { TimePicker } from './TimePicker';
import { DaySelector } from './DaySelector';

interface NotificationSettingCardProps {
  favorite: FavoriteLocation;
  subscriptionId: string;
  onSave: (data: {
    favorite_id: string;
    subscription_id: string;
    enabled: boolean;
    scheduled_time?: string;
    scheduled_days?: number[];
  }) => Promise<void>;
}

export function NotificationSettingCard({
  favorite,
  subscriptionId,
  onSave,
}: NotificationSettingCardProps) {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('07:00:00');
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]); // 평일 기본값
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!enabled) return;

    setIsSaving(true);
    try {
      await onSave({
        favorite_id: favorite.id,
        subscription_id: subscriptionId,
        enabled,
        scheduled_time: time,
        scheduled_days: days,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass p-6 rounded-lg space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">
            {favorite.nickname || favorite.name}
          </h3>
          <p className="text-sm text-white/60">{favorite.fullName}</p>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span className="text-sm">활성화</span>
        </label>
      </div>

      {/* 설정 폼 */}
      {enabled && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div>
            <label className="block text-sm font-medium mb-2">알림 시간</label>
            <TimePicker value={time} onChange={setTime} disabled={isSaving} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">요일 선택</label>
            <DaySelector value={days} onChange={setDays} disabled={isSaving} />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || days.length === 0}
            className="w-full glass px-4 py-3 rounded-lg font-medium hover:opacity-80 transition disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '알림 설정 저장'}
          </button>
        </div>
      )}
    </div>
  );
}
