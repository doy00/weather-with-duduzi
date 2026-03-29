import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FavoriteLocation } from '../types/favorite.types';
import { FavoriteCard } from './FavoriteCard';
import type { WeatherData } from '@/types/weather.types';

interface SortableItemProps {
  favorite: FavoriteLocation;
  weather?: WeatherData;
  isLoading: boolean;
  onSelectFavorite: (favorite: FavoriteLocation) => void;
  onRemove: (id: string) => void;
  onEditNickname: (id: string, nickname: string) => Promise<void>;
  themeClassName?: string;
  themeTextClassName?: string;
}

export const SortableItem = React.memo<SortableItemProps>(
  ({
    favorite,
    weather,
    isLoading,
    onSelectFavorite,
    onRemove,
    onEditNickname,
    themeClassName,
    themeTextClassName,
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: favorite.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <FavoriteCard
          favorite={favorite}
          weather={weather}
          isLoading={isLoading}
          onClick={() => onSelectFavorite(favorite)}
          onRemove={onRemove}
          onEditNickname={onEditNickname}
          themeClassName={themeClassName}
          themeTextClassName={themeTextClassName}
        />
      </div>
    );
  }
);
