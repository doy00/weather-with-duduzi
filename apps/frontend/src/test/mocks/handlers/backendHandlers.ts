import { http, HttpResponse } from 'msw';
import { mockWeatherData, mockHourlyWeather } from '../fixtures/weatherFixtures';
import type { GeocodingResult } from '@/types/location.types';

const BASE_URL = 'http://localhost:3001';

export const backendHandlers = [
  // GET /api/weather/current - Current weather via backend
  http.get(`${BASE_URL}/api/weather/current`, ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    // Error case: invalid coordinates
    if (lat === '999' || lon === '999') {
      return HttpResponse.json({ message: 'city not found' }, { status: 404 });
    }

    // Success case: return weather wrapped in backend response format
    const weatherData = mockWeatherData(Number(lat), Number(lon));
    return HttpResponse.json({ weather: weatherData });
  }),

  // GET /api/weather/hourly - Hourly forecast via backend
  http.get(`${BASE_URL}/api/weather/hourly`, ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    // Error case
    if (lat === '999' || lon === '999') {
      return HttpResponse.json({ message: 'city not found' }, { status: 404 });
    }

    // Success case: return forecast wrapped in backend response format
    const hourlyData = mockHourlyWeather();
    return HttpResponse.json({ forecast: hourlyData });
  }),

  // GET /api/location/geocode - Geocoding via backend
  http.get(`${BASE_URL}/api/location/geocode`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    // Error cases
    if (!query || query.includes('nonexistent') || query === ',KR' || query === '') {
      return HttpResponse.json({ results: [] });
    }

    // Success case: return geocoding results wrapped in backend format
    const cityName = query.split(',')[0];
    const results: GeocodingResult[] = [{ name: cityName, lat: 37.5665, lon: 126.978 }];
    return HttpResponse.json({ results });
  }),

  // GET /api/location/reverse-geocode - Reverse geocoding via backend
  http.get(`${BASE_URL}/api/location/reverse-geocode`, ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    // Error case
    if (lat === '999' || lon === '999') {
      return HttpResponse.json({ message: 'Location not found' }, { status: 404 });
    }

    // Success case: return location name wrapped in backend format
    return HttpResponse.json({ locationName: '서울특별시 강남구' });
  }),
];
