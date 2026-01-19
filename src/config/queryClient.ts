import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (!navigator.onLine) return false;
        return failureCount < 1;
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      networkMode: 'offlineFirst',
    },
  },
});
