import { useCallback } from 'react';
import { geocodeLocation } from '@/features/weather/services/weatherService';
import { GeocodingResult } from '@/types/location.types';

export const useGeocode = () => {
  const geocode = useCallback(async (query: string): Promise<GeocodingResult> => {
    try {
      const results = await geocodeLocation(query);
      if (!results || results.length === 0) {
        throw new Error("해당 장소의 정보가 제공되지 않습니다.");
      }
      return results[0];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("지역 검색 중 오류가 발생했습니다.");
    }
  }, []);

  return { geocode };
};
