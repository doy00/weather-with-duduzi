import { http, HttpResponse } from 'msw';
import { mockWeatherData, mockHourlyWeather } from '../fixtures/weatherFixtures';

const BASE_URL = 'https://api.openweathermap.org';

export const weatherHandlers = [
  // Current weather
  http.get(`${BASE_URL}/data/2.5/weather`, ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const apikey = url.searchParams.get('appid');

    if (apikey === 'invalid') {
      return HttpResponse.json({ message: 'Invalid API key' }, { status: 401 });
    }
    if (lat === '999') {
      return HttpResponse.json({ message: 'city not found' }, { status: 404 });
    }
    return HttpResponse.json(mockWeatherData(Number(lat), Number(lon)));
  }),

  // Hourly forecast
  http.get(`${BASE_URL}/data/2.5/forecast`, ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');

    if (lat === '999') {
      return HttpResponse.json({ message: 'city not found' }, { status: 404 });
    }
    return HttpResponse.json(mockHourlyWeather());
  }),

  // Geocoding
  http.get(`${BASE_URL}/geo/1.0/direct`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    if (!query || query.includes('nonexistent') || query === ',KR') {
      return HttpResponse.json([]);
    }
    const cityName = query.split(',')[0];
    return HttpResponse.json([
      { name: cityName, lat: 37.5665, lon: 126.978 },
    ]);
  }),

  // Reverse geocoding
  http.get(`${BASE_URL}/geo/1.0/reverse`, ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (lat === '999') {
      return HttpResponse.json([]);
    }

    return HttpResponse.json([
      {
        name: '서울',
        local_names: { ko: '서울특별시' },
        lat: Number(lat),
        lon: Number(lon),
      },
    ]);
  }),
];
