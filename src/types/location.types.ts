export interface LocationItem {
  id: string;
  fullName: string;
  name: string;
  nickname?: string;
  lat: number;
  lon: number;
}

export interface FavoriteLocation extends LocationItem {}

export interface GeocodingResult {
  lat: number;
  lon: number;
  name: string;
}
