import { IsArray, ArrayMinSize, ArrayMaxSize, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderFavoritesDto {
  @ApiProperty({
    description: '순서대로 정렬된 즐겨찾기 ID 배열',
    type: [String],
    minItems: 1,
    maxItems: 6,
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @IsUUID('4', { each: true })
  favoriteIds: string[];
}
