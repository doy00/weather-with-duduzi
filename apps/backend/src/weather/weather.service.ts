import { Injectable, Logger, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY') || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async fetchCurrentWeather(lat: number, lon: number) {
    try {
      const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=kr`;

      this.logger.debug(`Fetching current weather for lat=${lat}, lon=${lon}`);

      const response = await firstValueFrom(
        this.httpService.get(url, { timeout: 5000 })
      );

      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Fetch Current Weather');
    }
  }

  async fetchHourlyWeather(lat: number, lon: number) {
    try {
      const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=kr`;

      this.logger.debug(`Fetching hourly weather for lat=${lat}, lon=${lon}`);

      const response = await firstValueFrom(
        this.httpService.get(url, { timeout: 5000 })
      );

      return response.data;
    } catch (error) {
      this.handleApiError(error, 'Fetch Hourly Weather');
    }
  }

  private handleApiError(error: unknown, context: string): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      this.logger.error(`${context} failed: ${message}`, error.stack);

      if (status === 401) {
        throw new UnauthorizedException('API 키가 유효하지 않습니다.');
      }
      if (status === 404) {
        throw new NotFoundException('해당 장소의 정보가 제공되지 않습니다.');
      }

      throw new InternalServerErrorException('날씨 데이터를 가져올 수 없습니다.');
    }

    this.logger.error(`${context} failed with unknown error`, error);
    throw new InternalServerErrorException('네트워크 오류가 발생했습니다.');
  }
}
