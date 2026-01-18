import { useMemo } from 'react';
import { REGIONS } from '../constants/regions';

export const useLocationSearch = (query: string) => {
  const results = useMemo(() => {
    if (!query) return [];
    return REGIONS.filter(r => r.toLowerCase().includes(query.toLowerCase())).slice(0, 15);
  }, [query]);

  return results;
};
