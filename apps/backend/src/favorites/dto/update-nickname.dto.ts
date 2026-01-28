import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNicknameDto {
  @ApiProperty({
    description: '변경할 닉네임 (최소 1자)',
    example: '우리집',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  nickname: string;
}
