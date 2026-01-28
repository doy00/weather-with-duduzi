import { http, HttpResponse } from 'msw';

export const kakaoHandlers = [
  http.get('https://dapi.kakao.com/v2/local/geo/coord2address.json', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const url = new URL(request.url);
    const lon = url.searchParams.get('x');
    const lat = url.searchParams.get('y');

    if (!authHeader?.startsWith('KakaoAK ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (lat === '999' || lon === '999') {
      return HttpResponse.json({ documents: [] });
    }

    return HttpResponse.json({
      documents: [
        {
          address: {
            region_1depth_name: '서울특별시',
            region_2depth_name: '강남구',
            region_3depth_name: '역삼동',
          },
          road_address: null,
        },
      ],
    });
  }),
];
