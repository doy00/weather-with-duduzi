import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({
    description: '지역 전체 이름 (예: 서울특별시 강남구)',
    example: '서울특별시 강남구',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: '지역 간략 이름 (예: 강남구)',
    example: '강남구',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: '사용자 지정 닉네임',
    example: '우리집',
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    description: '위도 (-90 ~ 90)',
    example: 37.4979,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({
    description: '경도 (-180 ~ 180)',
    example: 127.0276,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;
}
