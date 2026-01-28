import i18n from '@/config/i18n';

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
        return apiError.message || i18n.t('errors:api.400');
      case 401:
        return i18n.t('errors:api.401');
      case 404:
        return i18n.t('errors:api.404');
      case 409:
        return apiError.message || i18n.t('errors:api.409');
      case 500:
        return i18n.t('errors:api.500');
      default:
        return apiError.message || fallbackMessage || i18n.t('errors:api.default');
    }
  }

  // Error 객체
  if (error instanceof Error) {
    return error.message;
  }

  // 네트워크 에러
  if (!navigator.onLine) {
    return i18n.t('errors:api.network');
  }

  return fallbackMessage || i18n.t('errors:api.unknown');
};

export const isErrorStatus = (error: unknown, status: number): boolean => {
  return (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    (error as ApiError).status === status
  );
};

export const isNetworkError = (): boolean => {
  return !navigator.onLine;
};
