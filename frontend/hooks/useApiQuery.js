import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export const useApiQuery = (queryKey, url, options = {}) =>
  useQuery({
    queryKey,
    queryFn: () => fetchJson(url),
    staleTime: options.staleTime ?? 60_000,
    gcTime: options.gcTime ?? 5 * 60_000,
    keepPreviousData: true,
    ...options
  });
