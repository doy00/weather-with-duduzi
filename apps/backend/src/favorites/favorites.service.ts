import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { FavoriteEntity } from './entities/favorite.entity';

const MAX_FAVORITES = 6;

@Injectable()
export class FavoritesService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(): Promise<FavoriteEntity[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async create(createFavoriteDto: CreateFavoriteDto): Promise<FavoriteEntity> {
    const supabase = this.supabaseService.getClient();

    // 최대 개수 확인
    const { count } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true });

    if (count !== null && count >= MAX_FAVORITES) {
      throw new BadRequestException(
        `즐겨찾기는 최대 ${MAX_FAVORITES}개까지 가능합니다.`,
      );
    }

    // 중복 확인
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('full_name', createFavoriteDto.fullName)
      .single();

    if (existing) {
      throw new BadRequestException('이미 즐겨찾기에 등록된 지역입니다.');
    }

    // 추가
    const { data, error } = await supabase
      .from('favorites')
      .insert([
        {
          full_name: createFavoriteDto.fullName,
          name: createFavoriteDto.name,
          nickname: createFavoriteDto.nickname,
          lat: createFavoriteDto.lat,
          lon: createFavoriteDto.lon,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.from('favorites').delete().eq('id', id);

    if (error) throw new NotFoundException('즐겨찾기를 찾을 수 없습니다.');
    return { success: true };
  }

  async updateNickname(
    id: string,
    updateNicknameDto: UpdateNicknameDto,
  ): Promise<FavoriteEntity> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('favorites')
      .update({
        nickname: updateNicknameDto.nickname,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new NotFoundException('즐겨찾기를 찾을 수 없습니다.');
    return data;
  }
}
