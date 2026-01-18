
export interface WeatherData {
  coord: { lat: number; lon: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
  };
  name: string;
  dt: number;
}

export interface HourlyWeather {
  list: Array<{
    dt: number;
    main: { temp: number };
    weather: Array<{ icon: string }>;
  }>;
}

export interface LocationItem {
  id: string;
  fullName: string;
  name: string;
  nickname?: string;
  lat: number;
  lon: number;
}

export interface FavoriteLocation extends LocationItem {
  currentTemp?: number;
  minTemp?: number;
  maxTemp?: number;
}
