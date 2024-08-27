import { SerializeFrom } from '@remix-run/node';
import { FetcherWithComponents, useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';

interface UseLoadFetcherDataOptions<T> {
  url: string;
  initialData?: FetcherWithComponents<SerializeFrom<T>>['data'];
}

export function useLoadFetcherData<T>({ url, initialData }: UseLoadFetcherDataOptions<T>) {
  const fetcher = useFetcher<T>();
  const [data, setData] = useState<typeof fetcher['data'] | undefined>(initialData);

  useEffect(() => {
    if (fetcher.data) {
      setData(fetcher.data);
    }
  }, [fetcher.data]);

  const loadData = useCallback((variables?: Record<string, string>) => {
    const searchParams = new URLSearchParams(variables);
    const fullUrl = `${url}${variables ? `?${searchParams.toString()}` : ''}`;
    fetcher.load(fullUrl);
  }, [fetcher, url]);

  return {
    data,
    isLoading: fetcher.state === 'loading',
    loadData,
  };
}
