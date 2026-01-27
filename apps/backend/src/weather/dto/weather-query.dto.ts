import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class WeatherQueryDto {
  @ApiProperty({
    description: '위도',
    example: 37.4979,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  lat: number;

  @ApiProperty({
    description: '경도',
    example: 127.0276,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  lon: number;
}
