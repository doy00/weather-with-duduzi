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
