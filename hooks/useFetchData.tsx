'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { apiCall } from '@/lib/client_functions';
import { start, stop } from '@/store/features/loaderSlice';
import { RootState } from '@/store/store';
import { set } from '@/store/features/dataSlice';

export default function useFetchData(url: string, cb?: () => void) {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loader.loading);
  const data = useSelector((state: RootState) => state.data.data);

  const refetch = async () => {
    dispatch(start());
    const res: any[] | any = await apiCall(url, null, 'GET', cb);
    dispatch(set(res?.data));
    dispatch(stop());
  };

  useEffect(() => {
    refetch();
  }, [url]);

  return { data, loading, refetch };
}
