export interface FavoriteLocation {
  id: string;
  fullName: string;
  name: string;
  nickname?: string;
  lat: number;
  lon: number;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AddFavoriteInput {
  fullName: string;
  name: string;
  lat: number;
  lon: number;
  nickname?: string;
}

export interface UpdateNicknameInput {
  id: string;
  nickname: string;
}

export interface ReorderFavoritesInput {
  favoriteIds: string[];
}
