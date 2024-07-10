'use client';

import { Button, Group, Stack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ForumItem, AskQuestion } from '@/components/Forum';
import useFetchData from '@/hooks/useFetchData';
import { ForumType } from '@/components/Forum/Forum.types';
import Skelton from '@/components/Skelton/Skelton';

const ForumPage = () => {
  const { data: forums, loading } = useFetchData('/api/forums');
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Group mb="md" justify="right">
        <Button onClick={open}>Ask Question</Button>
      </Group>
      <Stack>
        {loading ? (
          <Skelton items={6} height={90} />
        ) : (
          forums?.map((forum: ForumType) => (
            <ForumItem key={String(forum._id)} forum={forum} isMobile={isMobile} />
          ))
        )}
      </Stack>
      <AskQuestion opened={opened} close={close} />
    </>
  );
};

export default ForumPage;
