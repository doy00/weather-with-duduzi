export const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
export const WEATHER_BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL;
export const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// Publishable key (권장) 또는 legacy anon key (2026년 후반 deprecated)
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Web Push Notifications
export const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export const GEOLOCATION_TIMEOUT = 5000;
export const DEFAULT_LOCATION = {
  lat: 37.5665,
  lon: 126.9780,
  name: '서울특별시',
};
