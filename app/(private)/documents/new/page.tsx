'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { apiCall } from '@/lib/client_functions';

const DocumentsPage = () => {
  const router = useRouter();
  const createDocument = async () => {
    const res = await apiCall('/api/documents', { content: '' }, 'POST');
    router.push(`/documents/${res?.data._id}`);
  };

  useEffect(() => {
    createDocument();
  }, []);

  return <></>;
};

export default DocumentsPage;
