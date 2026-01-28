import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 시/도 이름을 축약하는 함수
 * @param name - 원본 지역명 (예: "인천광역시", "서울특별시", "경기도")
 * @returns 축약된 지역명 (예: "인천", "서울", "경기")
 */
export function shortenRegionName(name: string): string {
  return name
    .replace('특별시', '')      // "서울특별시" → "서울"
    .replace('광역시', '')      // "인천광역시" → "인천", "부산광역시" → "부산"
    .replace('특별자치시', '')  // "세종특별자치시" → "세종"
    .replace('특별자치도', '')  // "제주특별자치도" → "제주"
    .replace('도', '');         // "경기도" → "경기", "강원도" → "강원"
}
