import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { ReorderFavoritesDto } from './dto/reorder-favorites.dto';
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
      .order('display_order', { ascending: true, nullsFirst: true })


    if (error) throw error;
    return (data as FavoriteEntity[]) || [];
  }

  async create(createFavoriteDto: CreateFavoriteDto): Promise<FavoriteEntity> {
    const supabase = this.supabaseService.getClient();

    // 최대 개수 확인
    const { data: existingFavorites, error: countError } = await supabase
      .from('favorites')
      .select('id');

    if (countError) throw countError;

    const currentCount = existingFavorites?.length || 0;

    if (currentCount >= MAX_FAVORITES) {
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

    // 현재 최대 order 조회
    const { data: maxOrderData } = await supabase
      .from('favorites')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const newOrder = maxOrderData
      ? (maxOrderData as { display_order: number }).display_order + 1
      : 0;

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
          display_order: newOrder,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as FavoriteEntity;
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
    return data as FavoriteEntity;
  }

  async reorder(reorderDto: ReorderFavoritesDto) {
    const supabase = this.supabaseService.getClient();

    // ID 유효성 검증
    const { data: existingFavorites, error } = await supabase
      .from('favorites')
      .select('id')
      .in('id', reorderDto.favoriteIds);

    if (
      error ||
      !existingFavorites ||
      existingFavorites.length !== reorderDto.favoriteIds.length
    ) {
      throw new BadRequestException('일부 즐겨찾기를 찾을 수 없습니다.');
    }

    // 순서 업데이트 (병렬)
    const updatePromises = reorderDto.favoriteIds.map((id, index) =>
      supabase
        .from('favorites')
        .update({ display_order: index, updated_at: new Date().toISOString() })
        .eq('id', id),
    );

    const results = await Promise.all(updatePromises);

    if (results.some((r) => r.error)) {
      throw new BadRequestException('순서 변경 중 오류가 발생했습니다.');
    }

    return { success: true, message: '즐겨찾기 순서가 변경되었습니다.' };
  }
}
