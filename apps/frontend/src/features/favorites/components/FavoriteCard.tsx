import React, { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { GlassCard } from '@/features/shared/components/GlassCard';
import type { FavoriteLocation } from '@/features/favorites/types/favorite.types';
import type { WeatherData } from '@/types/weather.types';
import { formatTemperature } from '@/features/shared/utils/formatters';
import { NicknameEditor } from '@/features/favorites/components/NicknameEditor';

interface FavoriteCardProps {
  favorite: FavoriteLocation;
  weather?: WeatherData;
  isLoading: boolean;
  onClick?: () => void;
  onRemove: (id: string) => void;
  onEditNickname: (id: string, nickname: string) => Promise<void>;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  weather,
  isLoading,
  onClick,
  onRemove,
  onEditNickname,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <GlassCard
      onClick={onClick}
      className="p-5 relative"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(favorite.id);
        }}
        className="absolute top-3 right-3 p-1 glass bg-black/10 rounded-full hover:bg-black/20"
        aria-label={`${favorite.nickname || favorite.name} 즐겨찾기 제거`}
      >
        <X size={14} aria-hidden="true" />
      </button>

      <div className="flex flex-col h-full justify-between">
        <div className="mb-4">
          {editingId === favorite.id ? (
            <NicknameEditor
              initialValue={favorite.nickname || favorite.name}
              onSave={async (nickname) => {
                try {
                  await onEditNickname(favorite.id, nickname);
                  setEditingId(null);
                } catch (error) {
                  console.error('Failed to update nickname:', error);
                }
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-[15px] font-bold truncate max-w-[100px]">
                {favorite.nickname || favorite.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(favorite.id);
                }}
                className="text-[10px] opacity-60 flex items-center gap-1 mt-1 font-semibold"
                aria-label={`${favorite.nickname || favorite.name} 별칭 편집`}
              >
                <Edit2 size={10} aria-hidden="true" /> 별칭
              </button>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          {isLoading ? (
            <div className="w-8 h-8 bg-white/10 animate-pulse rounded-full" />
          ) : weather ? (
            <>
              <p className="text-3xl font-light">{formatTemperature(weather.main.temp)}</p>
              <div className="text-[10px] font-bold opacity-70 text-right leading-tight">
                <div>↑{formatTemperature(weather.main.temp_max)}</div>
                <div>↓{formatTemperature(weather.main.temp_min)}</div>
              </div>
            </>
          ) : (
            <span className="text-[10px] opacity-40">정보 없음</span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
