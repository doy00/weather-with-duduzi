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
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query},KR&limit=5&appid=${this.weatherApiKey}`;

      this.logger.debug(`Geocoding query: ${query}`);

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

      // 한글 지역명이 있으면 우선 사용
      if (result.local_names?.ko) {
        return result.local_names.ko;
      }

      // 시/도 + 시/군/구 조합
      const parts: string[] = [];
      if (result.state) parts.push(result.state);
      if (result.name) parts.push(result.name);

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

      // 도로명 주소가 있으면 우선 사용: 시/도 + 시/군/구 + 동
      if (roadAddress) {
        const parts: string[] = [];
        if (roadAddress.region_1depth_name)
          parts.push(String(roadAddress.region_1depth_name));
        if (roadAddress.region_2depth_name)
          parts.push(String(roadAddress.region_2depth_name));
        if (roadAddress.region_3depth_name)
          parts.push(String(roadAddress.region_3depth_name));
        return parts.join(' ');
      }

      // 지번 주소 사용: 시/도 + 시/군/구 + 동
      if (address) {
        const parts: string[] = [];
        if (address.region_1depth_name)
          parts.push(String(address.region_1depth_name));
        if (address.region_2depth_name)
          parts.push(String(address.region_2depth_name));
        if (address.region_3depth_name)
          parts.push(String(address.region_3depth_name));
        return parts.join(' ');
      }

      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.debug(`Kakao API error: ${error.message}`);
      }
      return null;
    }
  }
}
