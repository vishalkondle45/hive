'use client';

import { useFetch } from '@mantine/hooks';
import { Container, Title } from '@mantine/core';
import { Suggested } from '@/components/Network';
import { apiCall } from '@/lib/client_functions';
import useFetchData from '@/hooks/useFetchData';

const NetworkPage = () => {
  const { data } = useFetchData('/api/sparks/suggested');
  const { data: sparks, refetch: refetchSparks } = useFetch('/api/sparks');

  const onSpark = async (_id: string) => {
    await apiCall('/api/sparks', { to: _id }, 'POST');
    refetchSparks();
  };

  return (
    <Container px={0} size="xl">
      <Title order={3}>My Network</Title>
      <Suggested suggested={data} sparks={sparks} onSpark={onSpark} />
    </Container>
  );
};

export default NetworkPage;
