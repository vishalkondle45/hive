'use client';

import { Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Forum, AskQuestion } from '@/components/Forum';
import useFetchData from '@/hooks/useFetchData';

const ForumPage = ({ params }: { params: { forum: string } }) => {
  const { data, loading } = useFetchData(`/api/forums?_id=${params.forum}`);
  const [opened, { open, close }] = useDisclosure(false);

  if (loading) {
    return <></>;
  }

  return (
    <>
      <Group mb="md" justify="right">
        <Button onClick={open}>Ask Question</Button>
      </Group>
      <Forum forum={data[0]} />
      <AskQuestion opened={opened} close={close} />
    </>
  );
};

export default ForumPage;
