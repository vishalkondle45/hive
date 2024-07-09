'use client';

import { Button, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Forum, AskQuestion, ReplyToQuestion } from '@/components/Forum';
import useFetchData from '@/hooks/useFetchData';
import { ForumType } from '@/components/Forum/Forum.types';

const ForumPage = ({ params }: { params: { forum: string } }) => {
  const { data, refetch } = useFetchData(`/api/forums?_id=${params.forum}`);
  const [opened, { open, close }] = useDisclosure(false);

  if (!data?.length) {
    return <></>;
  }

  return (
    <>
      <Group mb="md" justify="right">
        <Button onClick={open}>Ask Question</Button>
      </Group>
      <Stack gap="xl">
        <Forum forum={data?.[0]} refetch={refetch} />
        {data?.[1]?.map((forum: ForumType) => (
          <Forum key={String(forum._id)} forum={forum} refetch={refetch} />
        ))}
        <ReplyToQuestion refetch={refetch} parent={data[0]?._id} />
      </Stack>
      <AskQuestion opened={opened} close={close} />
    </>
  );
};

export default ForumPage;
