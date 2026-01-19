import { WEATHER_API_KEY, WEATHER_BASE_URL, KAKAO_API_KEY } from '@/config/constants';
import { WeatherData, HourlyWeather } from '@/types/weather.types';
import { GeocodingResult } from '@/types/location.types';

export const fetchCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
    );

    if (response.status === 401) {
      throw new Error("API 키가 유효하지 않습니다.");
    }
    if (response.status === 404) {
      throw new Error("해당 장소의 정보가 제공되지 않습니다.");
    }
    if (!response.ok) {
      throw new Error("날씨 데이터를 가져올 수 없습니다.");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("네트워크 오류가 발생했습니다.");
  }
};

export const fetchHourlyWeather = async (lat: number, lon: number): Promise<HourlyWeather> => {
  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
    );

    if (!response.ok) {
      throw new Error("시간별 날씨 데이터를 가져올 수 없습니다.");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("네트워크 오류가 발생했습니다.");
  }
};

export const geocodeLocation = async (query: string): Promise<GeocodingResult[]> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query},KR&limit=5&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      return [];
    }

    const results = await response.json();
    if (!Array.isArray(results) || results.length === 0) {
      throw new Error("해당 장소의 정보가 제공되지 않습니다.");
    }

    return results.map((result: any) => ({
      lat: result.lat,
      lon: result.lon,
      name: result.name,
    }));
  } catch (error) {
    if (error instanceof Error && error.message === "해당 장소의 정보가 제공되지 않습니다.") {
      throw error;
    }
    throw new Error("지역 검색 중 오류가 발생했습니다.");
  }
};

// Kakao Local API를 사용한 상세 주소 조회
const getDetailedAddressFromKakao = async (lat: number, lon: number): Promise<string> => {
  if (!KAKAO_API_KEY) {
    throw new Error('Kakao API 키가 설정되지 않았습니다.');
  }

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`,
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Kakao API 호출에 실패했습니다.');
  }

  const data = await response.json();

  if (!data.documents || data.documents.length === 0) {
    throw new Error('주소 정보를 찾을 수 없습니다.');
  }

  const address = data.documents[0].address;
  const roadAddress = data.documents[0].road_address;

  // 도로명 주소가 있으면 우선 사용: 시/도 + 시/군/구 + 동
  if (roadAddress) {
    const parts = [];
    if (roadAddress.region_1depth_name) parts.push(roadAddress.region_1depth_name); // 시/도
    if (roadAddress.region_2depth_name) parts.push(roadAddress.region_2depth_name); // 시/군/구
    if (roadAddress.region_3depth_name) parts.push(roadAddress.region_3depth_name); // 동
    return parts.join(' ');
  }

  // 지번 주소 사용: 시/도 + 시/군/구 + 동
  if (address) {
    const parts = [];
    if (address.region_1depth_name) parts.push(address.region_1depth_name);
    if (address.region_2depth_name) parts.push(address.region_2depth_name);
    if (address.region_3depth_name) parts.push(address.region_3depth_name);
    return parts.join(' ');
  }

  throw new Error('주소 정보를 찾을 수 없습니다.');
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  // 1순위: Kakao API로 상세 주소 가져오기 (동 단위)
  try {
    return await getDetailedAddressFromKakao(lat, lon);
  } catch (kakaoError) {
    // Kakao API 실패 시 OpenWeatherMap API 사용 (시/도 수준)
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("역지오코딩에 실패했습니다.");
      }

      const results = await response.json();
      if (!Array.isArray(results) || results.length === 0) {
        throw new Error("위치 정보를 찾을 수 없습니다.");
      }

      const result = results[0];
      // 한글 지역명 구성: 시/도 + 시/군/구 (있는 경우)
      const parts = [];
      if (result.local_names?.ko) {
        return result.local_names.ko;
      }
      if (result.state) parts.push(result.state);
      if (result.name) parts.push(result.name);

      return parts.join(' ') || result.name || '알 수 없는 위치';
    } catch (error) {
      // 모든 API 실패 시 fallback
      return '내 위치';
    }
  }
};
