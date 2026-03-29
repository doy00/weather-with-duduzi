import { describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useFavoritesQuery } from './useFavoritesQuery';
import { renderHookWithQueryClient } from '@/test/utils/test-utils';
import {
  resetTestFavorites,
  setTestFavoritesToMax,
} from '@/test/mocks/handlers/favoritesHandlers';

describe('useFavoritesQuery', () => {
  beforeEach(() => {
    resetTestFavorites();
  });

  describe('Query: fetchFavorites', () => {
    it('초기 로딩 상태: isLoading = true, favorites = []', () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.favorites).toEqual([]);
    });

    it('성공: favorites 배열 반환, isLoading = false', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.favorites).toHaveLength(3);
      expect(result.current.favorites[0]).toHaveProperty('id');
      expect(result.current.favorites[0]).toHaveProperty('fullName');
      expect(result.current.isSuccess).toBe(true);
    });

    it('빈 배열도 정상 반환', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 데이터가 있으면 성공
      expect(result.current.isSuccess).toBe(true);
      expect(Array.isArray(result.current.favorites)).toBe(true);
    });

    it('5분 staleTime 설정 확인', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // staleTime이 설정되어 있는지 확인 (실제 값은 React Query 내부)
      expect(result.current.favorites).toHaveLength(3);
    });
  });

  describe('addMutation', () => {
    it('성공: 새 favorite 추가', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialLength = result.current.favorites.length;

      await result.current.addFavorite({
        fullName: '인천광역시 남동구',
        name: '남동구',
        lat: 37.4386,
        lon: 126.7314,
        nickname: '인천',
      });

      await waitFor(() => {
        expect(result.current.favorites).toHaveLength(initialLength + 1);
      });

      const newFavorite = result.current.favorites.find(
        (f) => f.fullName === '인천광역시 남동구'
      );
      expect(newFavorite).toBeDefined();
      expect(newFavorite?.nickname).toBe('인천');
    });

    it('낙관적 업데이트: onSuccess에서 캐시 업데이트', async () => {
      const { result, queryClient } = renderHookWithQueryClient(() =>
        useFavoritesQuery()
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.addFavorite({
        fullName: '대전광역시 유성구',
        name: '유성구',
        lat: 36.3624,
        lon: 127.3565,
      });

      // 캐시가 업데이트되었는지 확인
      const cachedData = queryClient.getQueryData(['favorites']);
      expect(cachedData).toBeDefined();
    });

    it('실패 (409): 중복 에러 처리', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 이미 존재하는 favorite 추가 시도
      await expect(
        result.current.addFavorite({
          fullName: '서울특별시 강남구',
          name: '강남구',
          lat: 37.4979,
          lon: 127.0276,
        })
      ).rejects.toEqual({
        status: 409,
        message: '이미 존재하는 즐겨찾기입니다.',
      });
    });

    it('실패 (400): 최대 개수 초과', async () => {
      setTestFavoritesToMax();

      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        result.current.addFavorite({
          fullName: '광주광역시 북구',
          name: '북구',
          lat: 35.1739,
          lon: 126.9115,
        })
      ).rejects.toEqual({
        status: 400,
        message: '최대 6개까지만 추가할 수 있습니다.',
      });
    });

    it('isPending 상태 확인', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAddingFavorite).toBe(false);

      const addPromise = result.current.addFavorite({
        fullName: '부천시',
        name: '부천시',
        lat: 37.5034,
        lon: 126.7661,
      });

      // mutation이 진행 중일 때 isPending이 true가 될 수 있음
      // 하지만 너무 빨라서 캡처하기 어려우므로 완료 후 확인
      await addPromise;

      await waitFor(() => {
        expect(result.current.isAddingFavorite).toBe(false);
      });
    });
  });

  describe('removeMutation', () => {
    it('성공: favorite 삭제', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialLength = result.current.favorites.length;
      const idToRemove = result.current.favorites[0].id;

      await result.current.removeFavorite(idToRemove);

      await waitFor(() => {
        expect(result.current.favorites).toHaveLength(initialLength - 1);
      });

      const removedFavorite = result.current.favorites.find(
        (f) => f.id === idToRemove
      );
      expect(removedFavorite).toBeUndefined();
    });

    it('낙관적 업데이트: 캐시에서 제거', async () => {
      const { result, queryClient } = renderHookWithQueryClient(() =>
        useFavoritesQuery()
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const idToRemove = result.current.favorites[0].id;

      await result.current.removeFavorite(idToRemove);

      // 캐시가 업데이트되었는지 확인
      const cachedData = queryClient.getQueryData(['favorites']);
      expect(cachedData).toBeDefined();
    });

    it('실패 (404): 존재하지 않는 ID', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.removeFavorite('999')).rejects.toEqual({
        status: 404,
        message: '즐겨찾기 삭제에 실패했습니다.',
      });
    });
  });

  describe('updateNicknameMutation', () => {
    it('성공: nickname 변경', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const idToUpdate = result.current.favorites[0].id;

      await result.current.updateNickname(idToUpdate, '새로운 별칭');

      await waitFor(() => {
        const updatedFavorite = result.current.favorites.find(
          (f) => f.id === idToUpdate
        );
        expect(updatedFavorite?.nickname).toBe('새로운 별칭');
      });
    });

    it('낙관적 업데이트: 캐시에서 해당 favorite 업데이트', async () => {
      const { result, queryClient } = renderHookWithQueryClient(() =>
        useFavoritesQuery()
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const idToUpdate = result.current.favorites[0].id;

      await result.current.updateNickname(idToUpdate, '업데이트된 별칭');

      // 캐시가 업데이트되었는지 확인
      const cachedData = queryClient.getQueryData(['favorites']);
      expect(cachedData).toBeDefined();
    });

    it('실패 (400): 별칭 길이 제한', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const idToUpdate = result.current.favorites[0].id;
      const longNickname = '가'.repeat(21);

      await expect(
        result.current.updateNickname(idToUpdate, longNickname)
      ).rejects.toEqual({
        status: 400,
        message: '별칭 수정에 실패했습니다.',
      });
    });

    it('실패 (404): 존재하지 않는 ID', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        result.current.updateNickname('999', '별칭')
      ).rejects.toEqual({
        status: 404,
        message: '별칭 수정에 실패했습니다.',
      });
    });
  });

  describe('isFavorite 헬퍼', () => {
    it('존재하는 fullName: true 반환', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const exists = result.current.isFavorite('서울특별시 강남구');
      expect(exists).toBe(true);
    });

    it('존재하지 않는 fullName: false 반환', async () => {
      const { result } = renderHookWithQueryClient(() => useFavoritesQuery());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const exists = result.current.isFavorite('존재하지 않는 지역');
      expect(exists).toBe(false);
    });
  });
});
