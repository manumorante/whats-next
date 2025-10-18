'use client';

import useSWR from 'swr';
import type { Context } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAllContexts() {
  const { data, error, isLoading } = useSWR<Context[]>('/api/contexts', fetcher);

  return {
    contexts: data || [],
    isLoading,
    error,
  };
}
