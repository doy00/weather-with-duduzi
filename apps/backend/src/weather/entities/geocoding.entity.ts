import { ApiProperty } from '@nestjs/swagger';

export class GeocodingEntity {
  @ApiProperty({ example: 37.5665, description: '위도' })
  lat: number;

  @ApiProperty({ example: 126.978, description: '경도' })
  lon: number;

  @ApiProperty({ example: '서울특별시' })
  name: string;

  @ApiProperty({ example: 'KR', required: false })
  country?: string;

  @ApiProperty({ example: 'Seoul', required: false })
  state?: string;
}
