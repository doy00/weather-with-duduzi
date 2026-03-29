import { ApiProperty } from '@nestjs/swagger';

class WeatherCondition {
  @ApiProperty({ example: 'Clear' })
  main: string;

  @ApiProperty({ example: '맑음' })
  description: string;

  @ApiProperty({ example: '01d' })
  icon: string;
}

class MainWeatherData {
  @ApiProperty({ example: 3.5, description: '현재 기온 (°C)' })
  temp: number;

  @ApiProperty({ example: 1.0, description: '체감 기온 (°C)' })
  feels_like: number;

  @ApiProperty({ example: 2.0 })
  temp_min: number;

  @ApiProperty({ example: 5.0 })
  temp_max: number;

  @ApiProperty({ example: 65 })
  humidity: number;

  @ApiProperty({ example: 1013 })
  pressure: number;
}

class WindData {
  @ApiProperty({ example: 2.5, description: '풍속 (m/s)' })
  speed: number;

  @ApiProperty({ example: 180, description: '풍향 (도)' })
  deg: number;
}

export class WeatherEntity {
  @ApiProperty({ type: MainWeatherData })
  main: MainWeatherData;

  @ApiProperty({ type: [WeatherCondition] })
  weather: WeatherCondition[];

  @ApiProperty({ type: WindData })
  wind: WindData;

  @ApiProperty({ example: 'Gangnam-gu' })
  name: string;

  @ApiProperty({ example: 1706253600, description: 'Unix timestamp' })
  dt: number;
}
