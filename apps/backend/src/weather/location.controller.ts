import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { GeocodeQueryDto } from './dto/geocode-query.dto';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { GeocodingEntity } from './entities/geocoding.entity';

@Controller('api/location')
@ApiTags('Location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('geocode')
  @ApiOperation({ summary: '지역명 검색' })
  @ApiResponse({ status: 200, description: '성공', type: [GeocodingEntity] })
  async geocode(@Query() query: GeocodeQueryDto) {
    const results = await this.locationService.geocode(query.q);
    return { results };
  }

  @Get('reverse-geocode')
  @ApiOperation({ summary: '좌표 → 지역명 변환' })
  @ApiResponse({ status: 200, description: '성공' })
  async reverseGeocode(@Query() query: WeatherQueryDto) {
    const locationName = await this.locationService.reverseGeocode(
      query.lat,
      query.lon,
    );
    return { locationName };
  }
}
