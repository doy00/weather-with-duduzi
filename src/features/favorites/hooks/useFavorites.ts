import { useState, useEffect } from 'react';
import { FavoriteLocation } from '../../../types/location.types';
import { MAX_FAVORITES } from '../../../config/constants';

const STORAGE_KEY = 'weather_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  const addFavorite = (location: FavoriteLocation) => {
    setFavorites(prev => {
      if (prev.length >= MAX_FAVORITES) {
        throw new Error(`즐겨찾기는 최대 ${MAX_FAVORITES}개까지 가능합니다.`);
      }
      const newFavorites = [...prev, { ...location, id: Date.now().toString() }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(f => f.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const updateNickname = (id: string, nickname: string) => {
    setFavorites(prev => {
      const newFavorites = prev.map(f => (f.id === id ? { ...f, nickname } : f));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (fullName: string) => {
    return favorites.some(f => f.fullName === fullName);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateNickname,
    isFavorite,
  };
};
