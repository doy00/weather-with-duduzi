import { IsUUID, IsBoolean, IsOptional, IsString, IsArray, IsInt, Min, Max } from 'class-validator';

export class CreateNotificationSettingDto {
  @IsUUID()
  favorite_id: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  scheduled_time?: string; // "07:00:00" 형식

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  scheduled_days?: number[]; // [1,2,3,4,5] = 평일
}
