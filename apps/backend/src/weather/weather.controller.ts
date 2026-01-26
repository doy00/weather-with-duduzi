import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherEntity } from './entities/weather.entity';

@Controller('api/weather')
@ApiTags('Weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  @ApiOperation({ summary: '현재 날씨 조회' })
  @ApiResponse({ status: 200, description: '성공', type: WeatherEntity })
  @ApiResponse({ status: 401, description: 'API 키 유효하지 않음' })
  @ApiResponse({ status: 404, description: '해당 장소 정보 없음' })
  async getCurrentWeather(@Query() query: WeatherQueryDto) {
    const weather = await this.weatherService.fetchCurrentWeather(query.lat, query.lon);
    return { weather };
  }

  @Get('hourly')
  @ApiOperation({ summary: '시간별 예보 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 401, description: 'API 키 유효하지 않음' })
  @ApiResponse({ status: 404, description: '해당 장소 정보 없음' })
  async getHourlyWeather(@Query() query: WeatherQueryDto) {
    const forecast = await this.weatherService.fetchHourlyWeather(query.lat, query.lon);
    return { forecast };
  }
}
