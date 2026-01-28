import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface GeocodingResult {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

interface KakaoAddress {
  region_1depth_name?: string;
  region_2depth_name?: string;
  region_3depth_name?: string;
}

interface ReverseGeocodingResult {
  name: string;
  state?: string;
  local_names?: {
    ko?: string;
  };
}

interface KakaoResponse {
  documents: Array<{
    address: KakaoAddress;
    road_address: KakaoAddress;
  }>;
}

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  private readonly weatherApiKey: string;
  private readonly kakaoApiKey: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.weatherApiKey =
      this.configService.get<string>('OPENWEATHERMAP_API_KEY') || '';
    this.kakaoApiKey = this.configService.get<string>('KAKAO_API_KEY');
  }

  async geocode(query: string) {
    try {
      // "제주특별자치도" → "제주", "서울특별시" → "서울"로 변환하여 검색 정확도 향상
      const shortenedQuery = this.shortenRegionName(query);
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${shortenedQuery},KR&limit=5&appid=${this.weatherApiKey}`;

      this.logger.debug(
        `Geocoding query: ${query} (shortened: ${shortenedQuery})`,
      );

      const response = await firstValueFrom(
        this.httpService.get(url, { timeout: 5000 }),
      );

      const results = response.data as GeocodingResult[];

      if (!Array.isArray(results) || results.length === 0) {
        return [];
      }

      return results.map((result) => ({
        lat: result.lat,
        lon: result.lon,
        name: result.name,
        country: result.country,
        state: result.state,
      }));
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Geocoding failed: ${error.message}`, error.stack);
      }
      return [];
    }
  }

  async reverseGeocode(lat: number, lon: number): Promise<string> {
    // 1단계: Kakao API 시도 (동 단위 상세 주소)
    if (this.kakaoApiKey) {
      try {
        const locationName = await this.getDetailedAddressFromKakao(lat, lon);
        if (locationName) {
          return locationName;
        }
      } catch {
        this.logger.debug('Kakao API failed, falling back to OpenWeatherMap');
      }
    }

    // 2단계: OpenWeatherMap Reverse Geocoding (시/도 수준)
    try {
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.weatherApiKey}`;

      this.logger.debug(`Reverse geocoding for lat=${lat}, lon=${lon}`);

      const response = await firstValueFrom(
        this.httpService.get(url, { timeout: 5000 }),
      );

      const results = response.data as ReverseGeocodingResult[];

      if (!Array.isArray(results) || results.length === 0) {
        return '내 위치';
      }

      const result = results[0];

      // 1순위: local_names.ko (한국어 이름)를 사용하고 축약
      if (result.local_names?.ko) {
        return this.shortenRegionName(result.local_names.ko);
      }

      // 2순위: state + name 조합 (영어 fallback)
      const parts: string[] = [];
      if (result.state) {
        parts.push(this.shortenRegionName(result.state));
      }
      if (result.name && result.name !== result.state) {
        parts.push(result.name);
      }

      return parts.join(' ') || result.name || '내 위치';
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `Reverse geocoding failed: ${error.message}`,
          error.stack,
        );
      }

      // 3단계: 모든 API 실패 시 fallback
      return '내 위치';
    }
  }

  private async getDetailedAddressFromKakao(
    lat: number,
    lon: number,
  ): Promise<string | null> {
    if (!this.kakaoApiKey) {
      return null;
    }

    try {
      const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `KakaoAK ${this.kakaoApiKey}`,
          },
          timeout: 5000,
        }),
      );

      const data = response.data as KakaoResponse;

      if (!data.documents || data.documents.length === 0) {
        return null;
      }

      const address = data.documents[0].address;
      const roadAddress = data.documents[0].road_address;

      // 도로명 주소가 있으면 우선 사용: 시/도(축약) + 시/군/구 (동 제외)
      if (roadAddress) {
        const parts: string[] = [];
        // 수정: region_1depth_name("인천광역시")을 shortenRegionName 함수로 축약 → "인천"
        if (roadAddress.region_1depth_name) {
          parts.push(
            this.shortenRegionName(String(roadAddress.region_1depth_name)),
          );
        }
        // 수정 전과 동일: region_2depth_name("계양구")을 그대로 추가
        if (roadAddress.region_2depth_name) {
          parts.push(String(roadAddress.region_2depth_name));
        }
        // 수정: region_3depth_name("작전동")을 제외하여 동 단위 숨김
        // 이전 코드에서는 parts.push(region_3depth_name) 했었음 → 제거
        return parts.join(' '); // "인천 계양구" 반환
      }

      // 지번 주소 사용: 시/도(축약) + 시/군/구 (동 제외)
      if (address) {
        const parts: string[] = [];
        // 수정: region_1depth_name("인천광역시")을 shortenRegionName 함수로 축약 → "인천"
        if (address.region_1depth_name) {
          parts.push(
            this.shortenRegionName(String(address.region_1depth_name)),
          );
        }
        // 수정 전과 동일: region_2depth_name("계양구")을 그대로 추가
        if (address.region_2depth_name) {
          parts.push(String(address.region_2depth_name));
        }
        // 수정: region_3depth_name("작전동")을 제외하여 동 단위 숨김
        // 이전 코드에서는 parts.push(region_3depth_name) 했었음 → 제거
        return parts.join(' '); // "인천 계양구" 반환
      }

      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.debug(`Kakao API error: ${error.message}`);
      }
      return null;
    }
  }

  /**
   * 수정: 시/도 이름을 축약하는 헬퍼 함수 추가
   * 목적: "인천광역시" → "인천", "서울특별시" → "서울"로 짧게 표시
   * @param name - 원본 지역명 (예: "인천광역시", "서울특별시", "경기도")
   * @returns 축약된 지역명 (예: "인천", "서울", "경기")
   */
  private shortenRegionName(name: string): string {
    return name
      .replace('특별시', '') // "서울특별시" → "서울"
      .replace('광역시', '') // "인천광역시" → "인천", "부산광역시" → "부산"
      .replace('특별자치시', '') // "세종특별자치시" → "세종"
      .replace('특별자치도', '') // "제주특별자치도" → "제주"
      .replace('도', ''); // "경기도" → "경기", "강원도" → "강원"
  }
}
