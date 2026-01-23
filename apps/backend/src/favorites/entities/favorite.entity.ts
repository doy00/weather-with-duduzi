import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FavoriteEntity {
  @ApiProperty({
    description: '즐겨찾기 고유 ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiPropertyOptional({
    description: '사용자 ID (인증 구현 후 사용)',
    example: 'user_123',
  })
  user_id?: string;

  @ApiProperty({
    description: '지역 전체 이름',
    example: '서울특별시 강남구',
  })
  full_name: string;

  @ApiProperty({
    description: '지역 간략 이름',
    example: '강남구',
  })
  name: string;

  @ApiPropertyOptional({
    description: '사용자 지정 닉네임',
    example: '우리집',
  })
  nickname?: string;

  @ApiProperty({
    description: '위도',
    example: 37.4979,
  })
  lat: number;

  @ApiProperty({
    description: '경도',
    example: 127.0276,
  })
  lon: number;

  @ApiPropertyOptional({
    description: '표시 순서 (0부터 시작)',
    example: 0,
  })
  display_order?: number;

  @ApiProperty({
    description: '생성 일시 (ISO 8601)',
    example: '2024-01-24T12:00:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: '수정 일시 (ISO 8601)',
    example: '2024-01-24T12:00:00Z',
  })
  updated_at: string;
}
