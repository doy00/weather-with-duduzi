import type { FavoriteLocation } from '@/features/favorites/types/favorite.types';

export function mockFavoriteLocation(
  overrides?: Partial<FavoriteLocation>
): FavoriteLocation {
  return {
    id: '1',
    fullName: '서울특별시 강남구',
    name: '강남구',
    nickname: '우리 집',
    lat: 37.4979,
    lon: 127.0276,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    ...overrides,
  };
}

export function mockFavoritesList(): FavoriteLocation[] {
  return [
    mockFavoriteLocation({
      id: '1',
      fullName: '서울특별시 강남구',
      name: '강남구',
      nickname: '우리 집',
    }),
    mockFavoriteLocation({
      id: '2',
      fullName: '부산광역시 해운대구',
      name: '해운대구',
      nickname: '부산',
      lat: 35.1628,
      lon: 129.1638,
    }),
    mockFavoriteLocation({
      id: '3',
      fullName: '제주특별자치도 제주시',
      name: '제주시',
      nickname: undefined,
      lat: 33.4996,
      lon: 126.5312,
    }),
  ];
}

export function mockMaxFavorites(): FavoriteLocation[] {
  return Array.from({ length: 6 }, (_, i) =>
    mockFavoriteLocation({
      id: String(i + 1),
      fullName: `Location ${i + 1}`,
      name: `Loc ${i + 1}`,
      nickname: i % 2 === 0 ? `별칭 ${i + 1}` : undefined,
      lat: 37.5 + i * 0.1,
      lon: 127.0 + i * 0.1,
    })
  );
}

export function mockNewFavorite(input: {
  fullName: string;
  name: string;
  lat: number;
  lon: number;
  nickname?: string;
}): FavoriteLocation {
  return {
    id: String(Math.floor(Math.random() * 10000)),
    fullName: input.fullName,
    name: input.name,
    nickname: input.nickname,
    lat: input.lat,
    lon: input.lon,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
