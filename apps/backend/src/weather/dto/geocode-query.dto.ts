import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class GeocodeQueryDto {
  @ApiProperty({ description: '검색할 지역명 (한글/영문)', example: '강남구', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  q: string;
}
