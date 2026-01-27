export interface LocationItem {
  id: string;
  fullName: string;
  name: string;
  nickname?: string;
  lat: number;
  lon: number;
}

export type FavoriteLocation = LocationItem;

export interface GeocodingResult {
  lat: number;
  lon: number;
  name: string;
}
