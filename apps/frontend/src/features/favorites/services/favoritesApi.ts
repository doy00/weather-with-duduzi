import type {
  FavoriteLocation,
  AddFavoriteInput,
  ReorderFavoritesInput,
} from '../types/favorite.types';
import { API_BASE_URL } from '@/config/constants';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
});

export const fetchFavorites = async (): Promise<FavoriteLocation[]> => {
  const response = await fetch(`${API_BASE_URL}/api/favorites`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw {
      status: response.status,
      message: '즐겨찾기 목록을 불러올 수 없습니다.',
    };
  }

  const data = await response.json();
  return data.favorites;
};

export const addFavoriteApi = async (
  location: AddFavoriteInput
): Promise<FavoriteLocation> => {
  const response = await fetch(`${API_BASE_URL}/api/favorites`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(location),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.message || '즐겨찾기 추가에 실패했습니다.',
    };
  }

  const data = await response.json();
  return data.favorite;
};

export const removeFavoriteApi = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/favorites/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw {
      status: response.status,
      message: '즐겨찾기 삭제에 실패했습니다.',
    };
  }
};

export const updateNicknameApi = async (
  id: string,
  nickname: string
): Promise<FavoriteLocation> => {
  const response = await fetch(`${API_BASE_URL}/api/favorites/${id}/nickname`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ nickname }),
  });

  if (!response.ok) {
    throw {
      status: response.status,
      message: '별칭 수정에 실패했습니다.',
    };
  }

  const data = await response.json();
  return data.favorite;
};

export const reorderFavoritesApi = async (
  input: ReorderFavoritesInput
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/favorites/reorder`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw {
      status: response.status,
      message: '순서 변경에 실패했습니다.',
    };
  }

  return response.json();
};
