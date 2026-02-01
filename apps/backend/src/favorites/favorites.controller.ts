import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { FavoriteEntity } from './entities/favorite.entity';

@ApiTags('Favorites')
@Controller('api/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({
    summary: '즐겨찾기 목록 조회',
    description: '저장된 모든 즐겨찾기 지역을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 목록 조회 성공',
    type: FavoriteEntity,
    isArray: true,
  })
  async findAll() {
    const favorites = await this.favoritesService.findAll();
    return { favorites };
  }

  @Post()
  @ApiOperation({
    summary: '즐겨찾기 추가',
    description: '새로운 지역을 즐겨찾기에 추가합니다.',
  })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiResponse({
    status: 201,
    description: '즐겨찾기 추가 성공',
    type: FavoriteEntity,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (유효성 검증 실패)',
  })
  async create(@Body() createFavoriteDto: CreateFavoriteDto) {
    const favorite = await this.favoritesService.create(createFavoriteDto);
    return { favorite };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '즐겨찾기 삭제',
    description: '특정 즐겨찾기를 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '즐겨찾기 ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: '즐겨찾기 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '즐겨찾기를 찾을 수 없음',
  })
  async remove(@Param('id') id: string) {
    return this.favoritesService.remove(id);
  }

  @Patch(':id/nickname')
  @ApiOperation({
    summary: '즐겨찾기 닉네임 수정',
    description: '특정 즐겨찾기의 닉네임을 변경합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '즐겨찾기 ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateNicknameDto })
  @ApiResponse({
    status: 200,
    description: '닉네임 수정 성공',
    type: FavoriteEntity,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (유효성 검증 실패)',
  })
  @ApiResponse({
    status: 404,
    description: '즐겨찾기를 찾을 수 없음',
  })
  async updateNickname(
    @Param('id') id: string,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ) {
    const favorite = await this.favoritesService.updateNickname(
      id,
      updateNicknameDto,
    );
    return { favorite };
  }

  /*
  @Patch('reorder')
  @ApiOperation({
    summary: '즐겨찾기 순서 변경',
    description: '즐겨찾기 목록의 표시 순서를 변경합니다.',
  })
  @ApiBody({ type: ReorderFavoritesDto })
  @ApiResponse({
    status: 200,
    description: '순서 변경 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '즐겨찾기 순서가 변경되었습니다.' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (유효성 검증 실패)',
  })
  async reorder(@Body() reorderDto: ReorderFavoritesDto) {
    return this.favoritesService.reorder(reorderDto);
  }
  */
}
