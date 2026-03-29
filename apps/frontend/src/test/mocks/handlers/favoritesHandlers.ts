import { http, HttpResponse } from 'msw';
import {
  mockFavoritesList,
  mockMaxFavorites,
  mockNewFavorite,
} from '../fixtures/favoriteFixtures';

const BASE_URL = 'http://localhost:3001';

// 테스트용 favorites 저장소 (초기화용)
let testFavorites = mockFavoritesList();

export const favoritesHandlers = [
  // GET /api/favorites - 즐겨찾기 목록 조회
  http.get(`${BASE_URL}/api/favorites`, () => {
    return HttpResponse.json({ favorites: testFavorites });
  }),

  // POST /api/favorites - 즐겨찾기 추가
  http.post(`${BASE_URL}/api/favorites`, async ({ request }) => {
    const body = (await request.json()) as {
      fullName: string;
      name: string;
      lat: number;
      lon: number;
      nickname?: string;
    };

    // 최대 개수 체크 (6개)
    if (testFavorites.length >= 6) {
      return HttpResponse.json(
        { message: '최대 6개까지만 추가할 수 있습니다.' },
        { status: 400 }
      );
    }

    // 중복 체크 (fullName 기준)
    const isDuplicate = testFavorites.some(
      (fav) => fav.fullName === body.fullName
    );
    if (isDuplicate) {
      return HttpResponse.json(
        { message: '이미 존재하는 즐겨찾기입니다.' },
        { status: 409 }
      );
    }

    // 새 즐겨찾기 생성
    const newFavorite = mockNewFavorite(body);
    testFavorites.push(newFavorite);

    return HttpResponse.json({ favorite: newFavorite }, { status: 201 });
  }),

  // DELETE /api/favorites/:id - 즐겨찾기 삭제
  http.delete(`${BASE_URL}/api/favorites/:id`, ({ params }) => {
    const { id } = params;

    const index = testFavorites.findIndex((fav) => fav.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { message: '존재하지 않는 즐겨찾기입니다.' },
        { status: 404 }
      );
    }

    testFavorites.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),

  // PATCH /api/favorites/:id/nickname - 별칭 수정
  http.patch(`${BASE_URL}/api/favorites/:id/nickname`, async ({ request, params }) => {
    const { id } = params;
    const { nickname } = (await request.json()) as { nickname: string };

    const favorite = testFavorites.find((fav) => fav.id === id);

    if (!favorite) {
      return HttpResponse.json(
        { message: '존재하지 않는 즐겨찾기입니다.' },
        { status: 404 }
      );
    }

    // 별칭 길이 검증
    if (nickname && nickname.length > 20) {
      return HttpResponse.json(
        { message: '별칭은 20자 이내로 입력해주세요.' },
        { status: 400 }
      );
    }

    // 별칭 업데이트
    const updatedFavorite = {
      ...favorite,
      nickname: nickname || undefined,
      updated_at: new Date().toISOString(),
    };

    const index = testFavorites.findIndex((fav) => fav.id === id);
    testFavorites[index] = updatedFavorite;

    return HttpResponse.json({ favorite: updatedFavorite });
  }),
];

// 테스트용 헬퍼: favorites 상태 초기화
export function resetTestFavorites() {
  testFavorites = mockFavoritesList();
}

// 테스트용 헬퍼: favorites 상태를 최대 개수로 설정
export function setTestFavoritesToMax() {
  testFavorites = mockMaxFavorites();
}

// 테스트용 헬퍼: favorites 상태를 빈 배열로 설정
export function clearTestFavorites() {
  testFavorites = [];
}
