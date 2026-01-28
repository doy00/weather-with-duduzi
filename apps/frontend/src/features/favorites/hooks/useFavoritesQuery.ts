import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  FavoriteLocation,
  ReorderFavoritesInput,
} from '../types/favorite.types';
import { FAVORITES_QUERY_KEY } from '../constants';
import {
  fetchFavorites,
  addFavoriteApi,
  removeFavoriteApi,
  updateNicknameApi,
  reorderFavoritesApi,
} from '../services/favoritesApi';
import { tabSync } from '@/lib/tabSync';
import { fetchCurrentWeather } from '@/features/weather/services/weatherService';

export function useFavoritesQuery() {
  const queryClient = useQueryClient();

  const { data: favorites = [], ...queryState } = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 탭 간 동기화
  useEffect(() => {
    const unsubscribe = tabSync.subscribe((message) => {
      switch (message.type) {
        case 'FAVORITES_INVALIDATE':
        case 'FAVORITE_ADDED':
        case 'FAVORITE_REMOVED':
        case 'NICKNAME_UPDATED':
        case 'FAVORITES_REORDERED':
          queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  const addMutation = useMutation({
    mutationFn: addFavoriteApi,
    onSuccess: (newFavorite) => {
      queryClient.setQueryData<FavoriteLocation[]>(FAVORITES_QUERY_KEY, (old = []) => [
        ...old,
        newFavorite,
      ]);

      // 새 위치의 날씨 즉시 가져오기
      queryClient.prefetchQuery({
        queryKey: ['weather', newFavorite.lat, newFavorite.lon],
        queryFn: () => fetchCurrentWeather(newFavorite.lat, newFavorite.lon),
      });

      tabSync.send({ type: 'FAVORITE_ADDED', data: { id: newFavorite.id } });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavoriteApi,
    onSuccess: (_, removedId) => {
      queryClient.setQueryData<FavoriteLocation[]>(FAVORITES_QUERY_KEY, (old = []) =>
        old.filter((f) => f.id !== removedId)
      );

      tabSync.send({ type: 'FAVORITE_REMOVED', data: { id: removedId } });
    },
  });

  const updateNicknameMutation = useMutation({
    mutationFn: ({ id, nickname }: { id: string; nickname: string }) =>
      updateNicknameApi(id, nickname),
    onSuccess: (updatedFavorite) => {
      queryClient.setQueryData<FavoriteLocation[]>(FAVORITES_QUERY_KEY, (old = []) =>
        old.map((f) => (f.id === updatedFavorite.id ? updatedFavorite : f))
      );

      tabSync.send({
        type: 'NICKNAME_UPDATED',
        data: { id: updatedFavorite.id, nickname: updatedFavorite.nickname || '' },
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderFavoritesApi,
    onMutate: async (newOrder: ReorderFavoritesInput) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      const previousFavorites = queryClient.getQueryData<FavoriteLocation[]>(
        FAVORITES_QUERY_KEY
      );

      queryClient.setQueryData<FavoriteLocation[]>(FAVORITES_QUERY_KEY, (old = []) => {
        const orderMap = new Map(newOrder.favoriteIds.map((id, index) => [id, index]));
        return [...old].sort((a, b) => {
          const orderA = orderMap.get(a.id) ?? 999;
          const orderB = orderMap.get(b.id) ?? 999;
          return orderA - orderB;
        });
      });

      return { previousFavorites };
    },
    onError: (_, __, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSuccess: () => {
      tabSync.send({ type: 'FAVORITES_REORDERED', data: {} });
    },
  });

  const isFavorite = (fullName: string) => {
    return favorites.some((f) => f.fullName === fullName);
  };

  return {
    favorites,
    isFavorite,
    addFavorite: addMutation.mutateAsync,
    removeFavorite: removeMutation.mutateAsync,
    updateNickname: (id: string, nickname: string) =>
      updateNicknameMutation.mutateAsync({ id, nickname }),
    reorderFavorites: reorderMutation.mutateAsync,
    isAddingFavorite: addMutation.isPending,
    isRemovingFavorite: removeMutation.isPending,
    isUpdatingNickname: updateNicknameMutation.isPending,
    isReordering: reorderMutation.isPending,
    ...queryState,
  };
}
