import type { WeatherData, HourlyWeather } from '@/types/weather.types';

export function mockWeatherData(lat: number, lon: number): WeatherData {
  return {
    coord: { lat, lon },
    weather: [{ main: 'Clear', description: '맑음', icon: '01d' }],
    main: {
      temp: 15.5,
      temp_min: 10.2,
      temp_max: 18.3,
      feels_like: 14.8,
      humidity: 65,
    },
    name: '서울',
    dt: Math.floor(Date.now() / 1000),
  };
}

export function mockWeatherDataRainy(): WeatherData {
  return {
    ...mockWeatherData(37.5665, 126.978),
    weather: [{ main: 'Rain', description: '비', icon: '10d' }],
    main: {
      temp: 12.0,
      temp_min: 10.0,
      temp_max: 14.0,
      feels_like: 11.5,
      humidity: 85,
    },
  };
}

export function mockWeatherDataSnowy(): WeatherData {
  return {
    ...mockWeatherData(37.5665, 126.978),
    weather: [{ main: 'Snow', description: '눈', icon: '13d' }],
    main: {
      temp: -2.0,
      temp_min: -5.0,
      temp_max: 0.0,
      feels_like: -6.0,
      humidity: 80,
    },
  };
}

export function mockWeatherDataCold(): WeatherData {
  return {
    ...mockWeatherData(37.5665, 126.978),
    weather: [{ main: 'Clear', description: '맑음', icon: '01d' }],
    main: {
      temp: 2.0,
      temp_min: -1.0,
      temp_max: 4.0,
      feels_like: -2.0,
      humidity: 60,
    },
  };
}

export function mockWeatherDataHot(): WeatherData {
  return {
    ...mockWeatherData(37.5665, 126.978),
    weather: [{ main: 'Clear', description: '맑음', icon: '01d' }],
    main: {
      temp: 32.0,
      temp_min: 28.0,
      temp_max: 35.0,
      feels_like: 34.0,
      humidity: 70,
    },
  };
}

export function mockHourlyWeather(): HourlyWeather {
  return {
    list: Array.from({ length: 40 }, (_, i) => ({
      dt: Math.floor(Date.now() / 1000) + i * 10800,
      main: { temp: 15 + Math.sin(i / 4) * 5 },
      weather: [{ icon: i % 2 === 0 ? '01d' : '02d' }],
    })),
  };
}

export function mockHourlyWeatherEmpty(): HourlyWeather {
  return {
    list: [],
  };
}

export function mockHourlyWeatherToday(): HourlyWeather {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = Math.floor(today.getTime() / 1000);

  return {
    list: [
      { dt: todayTs + 3600, main: { temp: 10 }, weather: [{ icon: '01d' }] },
      { dt: todayTs + 7200, main: { temp: 15 }, weather: [{ icon: '01d' }] },
      { dt: todayTs + 10800, main: { temp: 20 }, weather: [{ icon: '01d' }] },
      { dt: todayTs + 14400, main: { temp: 18 }, weather: [{ icon: '02d' }] },
    ],
  };
}
