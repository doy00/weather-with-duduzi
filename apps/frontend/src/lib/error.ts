interface ApiError {
  status?: number;
  message?: string;
}

export const handleApiError = (
  error: unknown,
  context: string,
  fallbackMessage?: string
): string => {
  // 개발 환경 로깅
  if (import.meta.env.DEV) {
    console.error(`[${context}] Error:`, error);
  }

  // Fetch 응답 에러
  if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
    const apiError = error as ApiError;

    switch (apiError.status) {
      case 400:
        return apiError.message || '잘못된 요청입니다.';
      case 401:
        return '인증이 필요합니다.';
      case 404:
        return '요청한 데이터를 찾을 수 없습니다.';
      case 409:
        return apiError.message || '이미 존재하는 데이터입니다.';
      case 500:
        return '서버 오류가 발생했습니다.';
      default:
        return apiError.message || fallbackMessage || '요청에 실패했습니다.';
    }
  }

  // Error 객체
  if (error instanceof Error) {
    return error.message;
  }

  // 네트워크 에러
  if (!navigator.onLine) {
    return '네트워크 연결을 확인해 주세요.';
  }

  return fallbackMessage || '알 수 없는 오류가 발생했습니다.';
};

export const isErrorStatus = (error: unknown, status: number): boolean => {
  return (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    (error as ApiError).status === status
  );
};

export const isNetworkError = (error: unknown): boolean => {
  return !navigator.onLine;
};
