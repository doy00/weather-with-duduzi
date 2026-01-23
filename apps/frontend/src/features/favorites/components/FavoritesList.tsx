import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { UseQueryResult } from '@tanstack/react-query';
import type { FavoriteLocation } from '@/features/favorites/types/favorite.types';
import type { WeatherData } from '@/types/weather.types';
import { SortableItem } from './SortableItem';

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  weatherResults: UseQueryResult<WeatherData, Error>[];
  onSelectFavorite: (favorite: FavoriteLocation) => void;
  onRemove: (id: string) => void;
  onUpdateNickname: (id: string, nickname: string) => Promise<void>;
  onReorder: (favoriteIds: string[]) => Promise<void>;
  themeClassName?: string;
  themeTextClassName?: string;
}

export const FavoritesList = React.memo<FavoritesListProps>(({
  favorites,
  weatherResults,
  onSelectFavorite,
  onRemove,
  onUpdateNickname,
  onReorder,
  themeClassName = 'glass bg-white/10',
  themeTextClassName = 'text-white',
}) => {
  const [localFavorites, setLocalFavorites] = useState(favorites);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = localFavorites.findIndex((f) => f.id === active.id);
      const newIndex = localFavorites.findIndex((f) => f.id === over.id);

      const newOrder = arrayMove(localFavorites, oldIndex, newIndex);
      setLocalFavorites(newOrder);

      try {
        await onReorder(newOrder.map((f) => f.id));
      } catch (error) {
        setLocalFavorites(favorites);
      }
    },
    [localFavorites, favorites, onReorder]
  );

  const handleRemove = useCallback((id: string) => {
    onRemove(id);
  }, [onRemove]);

  const handleUpdateNickname = useCallback(
    (id: string, nickname: string) => {
      return onUpdateNickname(id, nickname);
    },
    [onUpdateNickname]
  );

  if (localFavorites.length === 0) return null;

  return (
    <div className="mt-10 mb-6">
      <h3 className="text-xs font-black opacity-60 mb-4 uppercase tracking-widest px-2">
        즐겨찾는 지역
      </h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localFavorites.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {localFavorites.map((fav, index) => (
              <SortableItem
                key={fav.id}
                favorite={fav}
                weather={weatherResults[index]?.data}
                isLoading={weatherResults[index]?.isLoading ?? false}
                onSelectFavorite={onSelectFavorite}
                onRemove={handleRemove}
                onEditNickname={handleUpdateNickname}
                themeClassName={themeClassName}
                themeTextClassName={themeTextClassName}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
});
