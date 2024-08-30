import { SerializeFrom } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';
import { uniqBy } from 'lodash-es';

type DataType<T> = SerializeFrom<T>;

interface UseLoadFetcherDataOptions<T> {
  url: string;
  initialData?: DataType<T>;
  isDataAnObject?: boolean;
}

export function useLoadFetcherData<T>({ url, initialData, isDataAnObject = false }: UseLoadFetcherDataOptions<T>) {
  const fetcher = useFetcher<T>();
  const emptyInitialData = (isDataAnObject ? {} : []) as DataType<T>;
  const [data, setData] = useState<DataType<T>>(initialData || emptyInitialData);

  useEffect(() => {
    if (fetcher.data) {
      if (isDataAnObject) {
        setData(prev => {
          const prevObject = typeof prev === 'object' ? prev : {};
          const newData = typeof fetcher.data === 'object' ? fetcher.data : {};
          
          const mergedData = { ...prevObject } as Record<string, any>;
          
          for (const key in newData) {
            if (Object.prototype.hasOwnProperty.call(newData, key)) {
              if (Array.isArray((newData as Record<string, any>)[key])) {
                if (Array.isArray(mergedData[key])) {
                  mergedData[key] = uniqBy([...mergedData[key], ...(newData as Record<string, any>)[key]], 'id');
                } else {
                  mergedData[key] = uniqBy((newData as Record<string, any>)[key], 'id');
                }
              } else {
                mergedData[key] = (newData as Record<string, any>)[key];
              }
            }
          }
          
          return mergedData as DataType<T>;
        });
      } else {
        setData(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          const newData = Array.isArray(fetcher.data) ? fetcher.data : [];
          return uniqBy([...prevArray, ...newData], 'id') as DataType<T>;
        });
      }
    }
  }, [fetcher.data, isDataAnObject]);

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
