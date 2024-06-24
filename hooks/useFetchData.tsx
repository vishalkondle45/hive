'use client';

import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/client_functions';

export default function useFetchData(url: string) {
  const [data, setData] = useState(null) as any;
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    const res: any[] | any = await apiCall(url);
    setData(res?.data);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, [url]);

  return { data, loading, refetch };
}
