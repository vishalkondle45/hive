'use client';

import { Button, Group, Stack, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ForumItem, AskQuestion } from '@/components/Forum';
import useFetchData from '@/hooks/useFetchData';
import { ForumType } from '@/components/Forum/Forum.types';

const ForumPage = ({ params }: { params: { tag: string } }) => {
  const { data } = useFetchData(`/api/forums?tag=${params.tag}`);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!data) {
    return <></>;
  }

  return (
    <>
      <Group mb="md" justify="space-between">
        <Title>#{params.tag}</Title>
        <Button onClick={open}>Ask Question</Button>
      </Group>
      <Stack>
        {data?.map((forum: ForumType) => (
          <ForumItem
            key={String(forum._id)}
            forum={forum}
            isMobile={isMobile}
            selectedTag={params.tag}
          />
        ))}
      </Stack>
      <AskQuestion opened={opened} close={close} />
    </>
  );
};

export default ForumPage;
