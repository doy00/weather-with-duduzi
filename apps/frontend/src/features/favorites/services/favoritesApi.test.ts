import { describe, it, expect, beforeEach } from 'vitest';
import {
  fetchFavorites,
  addFavoriteApi,
  removeFavoriteApi,
  updateNicknameApi,
} from './favoritesApi';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import {
  resetTestFavorites,
  setTestFavoritesToMax,
  clearTestFavorites,
} from '@/test/mocks/handlers/favoritesHandlers';
import type { FavoriteLocation } from '../types/favorite.types';

describe('favoritesApi', () => {
  beforeEach(() => {
    // 각 테스트 전에 favorites 상태 초기화
    resetTestFavorites();
  });

  describe('fetchFavorites', () => {
    it('성공: FavoriteLocation[] 반환', async () => {
      const result = await fetchFavorites();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('fullName');
      expect(result[0]).toHaveProperty('lat');
      expect(result[0]).toHaveProperty('lon');
    });

    it('성공: 빈 배열도 정상 반환', async () => {
      clearTestFavorites();

      const result = await fetchFavorites();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('실패 (404): status + message throw', async () => {
      server.use(
        http.get('http://localhost:3001/api/favorites', () =>
          HttpResponse.json(
            { message: '즐겨찾기를 찾을 수 없습니다.' },
            { status: 404 }
          )
        )
      );

      await expect(fetchFavorites()).rejects.toEqual({
        status: 404,
        message: '즐겨찾기 목록을 불러올 수 없습니다.',
      });
    });

    it('실패 (500): status + message throw', async () => {
      server.use(
        http.get('http://localhost:3001/api/favorites', () =>
          HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          )
        )
      );

      await expect(fetchFavorites()).rejects.toEqual({
        status: 500,
        message: '즐겨찾기 목록을 불러올 수 없습니다.',
      });
    });

    it('네트워크 오류: fetch 실패', async () => {
      server.use(
        http.get('http://localhost:3001/api/favorites', () =>
          HttpResponse.error()
        )
      );

      await expect(fetchFavorites()).rejects.toThrow();
    });
  });

  describe('addFavoriteApi', () => {
    it('성공: 새 FavoriteLocation 반환', async () => {
      const newLocation = {
        fullName: '인천광역시 남동구',
        name: '남동구',
        lat: 37.4386,
        lon: 126.7314,
        nickname: '인천',
      };

      const result = await addFavoriteApi(newLocation);

      expect(result).toHaveProperty('id');
      expect(result.fullName).toBe(newLocation.fullName);
      expect(result.nickname).toBe(newLocation.nickname);
      expect(result.lat).toBe(newLocation.lat);
      expect(result.lon).toBe(newLocation.lon);
    });

    it('성공: nickname 없이 추가', async () => {
      const newLocation = {
        fullName: '대전광역시 유성구',
        name: '유성구',
        lat: 36.3624,
        lon: 127.3565,
      };

      const result = await addFavoriteApi(newLocation);

      expect(result).toHaveProperty('id');
      expect(result.fullName).toBe(newLocation.fullName);
      expect(result.nickname).toBeUndefined();
    });

    it('실패 (400): 최대 6개까지만 추가할 수 있습니다', async () => {
      setTestFavoritesToMax();

      const newLocation = {
        fullName: '광주광역시 북구',
        name: '북구',
        lat: 35.1739,
        lon: 126.9115,
      };

      await expect(addFavoriteApi(newLocation)).rejects.toEqual({
        status: 400,
        message: '최대 6개까지만 추가할 수 있습니다.',
      });
    });

    it('실패 (409): 이미 존재하는 즐겨찾기입니다', async () => {
      const duplicateLocation = {
        fullName: '서울특별시 강남구',
        name: '강남구',
        lat: 37.4979,
        lon: 127.0276,
      };

      await expect(addFavoriteApi(duplicateLocation)).rejects.toEqual({
        status: 409,
        message: '이미 존재하는 즐겨찾기입니다.',
      });
    });

    it('실패 (JSON 파싱 실패): fallback 메시지', async () => {
      server.use(
        http.post('http://localhost:3001/api/favorites', () =>
          new HttpResponse('Invalid JSON', { status: 400 })
        )
      );

      const newLocation = {
        fullName: '서울특별시 종로구',
        name: '종로구',
        lat: 37.5735,
        lon: 126.979,
      };

      await expect(addFavoriteApi(newLocation)).rejects.toEqual({
        status: 400,
        message: '즐겨찾기 추가에 실패했습니다.',
      });
    });

    it('네트워크 오류: fetch 실패', async () => {
      server.use(
        http.post('http://localhost:3001/api/favorites', () =>
          HttpResponse.error()
        )
      );

      const newLocation = {
        fullName: '서울특별시 종로구',
        name: '종로구',
        lat: 37.5735,
        lon: 126.979,
      };

      await expect(addFavoriteApi(newLocation)).rejects.toThrow();
    });
  });

  describe('removeFavoriteApi', () => {
    it('성공: void 반환', async () => {
      const result = await removeFavoriteApi('1');

      expect(result).toBeUndefined();
    });

    it('실패 (404): 존재하지 않는 즐겨찾기입니다', async () => {
      await expect(removeFavoriteApi('999')).rejects.toEqual({
        status: 404,
        message: '즐겨찾기 삭제에 실패했습니다.',
      });
    });

    it('실패 (500): 즐겨찾기 삭제에 실패했습니다', async () => {
      server.use(
        http.delete('http://localhost:3001/api/favorites/:id', () =>
          HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          )
        )
      );

      await expect(removeFavoriteApi('1')).rejects.toEqual({
        status: 500,
        message: '즐겨찾기 삭제에 실패했습니다.',
      });
    });

    it('네트워크 오류: fetch 실패', async () => {
      server.use(
        http.delete('http://localhost:3001/api/favorites/:id', () =>
          HttpResponse.error()
        )
      );

      await expect(removeFavoriteApi('1')).rejects.toThrow();
    });
  });

  describe('updateNicknameApi', () => {
    it('성공: 업데이트된 FavoriteLocation 반환', async () => {
      const result = await updateNicknameApi('1', '새로운 별칭');

      expect(result).toHaveProperty('id', '1');
      expect(result.nickname).toBe('새로운 별칭');
      expect(result).toHaveProperty('updated_at');
    });

    it('성공: 별칭 제거 (빈 문자열)', async () => {
      const result = await updateNicknameApi('1', '');

      expect(result).toHaveProperty('id', '1');
      expect(result.nickname).toBeUndefined();
    });

    it('실패 (400): 별칭 수정에 실패했습니다', async () => {
      const longNickname = '가'.repeat(21);

      await expect(updateNicknameApi('1', longNickname)).rejects.toEqual({
        status: 400,
        message: '별칭 수정에 실패했습니다.',
      });
    });

    it('실패 (404): 존재하지 않는 즐겨찾기입니다', async () => {
      await expect(updateNicknameApi('999', '별칭')).rejects.toEqual({
        status: 404,
        message: '별칭 수정에 실패했습니다.',
      });
    });

    it('실패 (500): 별칭 수정에 실패했습니다', async () => {
      server.use(
        http.patch('http://localhost:3001/api/favorites/:id/nickname', () =>
          HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          )
        )
      );

      await expect(updateNicknameApi('1', '별칭')).rejects.toEqual({
        status: 500,
        message: '별칭 수정에 실패했습니다.',
      });
    });

    it('네트워크 오류: fetch 실패', async () => {
      server.use(
        http.patch('http://localhost:3001/api/favorites/:id/nickname', () =>
          HttpResponse.error()
        )
      );

      await expect(updateNicknameApi('1', '별칭')).rejects.toThrow();
    });
  });
});
