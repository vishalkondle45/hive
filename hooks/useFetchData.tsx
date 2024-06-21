'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { failure } from '@/lib/client_functions';

export default function useFetchData(url: string) {
  const [data, setData] = useState(null) as any;
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    try {
      setLoading(true);
      const res: any[] | any = await axios.get(url);
      setData(res?.data);
    } catch (err: any) {
      failure(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [url]);

  return { data, loading, refetch };
}
