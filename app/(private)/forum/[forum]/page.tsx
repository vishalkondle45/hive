'use client';

import { useEffect, useState } from 'react';
import { Button, Divider, Group, rem, Select, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { Forum, AskQuestion, ReplyToQuestion } from '@/components/Forum';
import useFetchData from '@/hooks/useFetchData';
import { ForumType } from '@/components/Forum/Forum.types';
import { FORUM_ANSWERS_SORT_OPTIONS } from '@/lib/constants';

const ForumPage = ({ params }: { params: { forum: string } }) => {
  const { data, refetch } = useFetchData(`/api/forums?_id=${params.forum}`);
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<string | null>('highest');
  const [answers, setAnswers] = useState(data?.[1]);

  useEffect(() => {
    if (!data?.length || !data[1]) {
      return;
    }
    const sortIt = [...data[1]];
    switch (value) {
      case 'newest':
        sortIt.sort((a: any, b: any) => dayjs(b.updatedAt).diff(dayjs(a.updatedAt), 'seconds'));
        break;
      case 'oldest':
        sortIt.sort((a: any, b: any) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt), 'seconds'));
        break;
      default:
        sortIt.sort(
          (a: any, b: any) =>
            b.upvotes.length - b.downvotes.length - (a.upvotes.length - a.downvotes.length)
        );
        break;
    }
    setAnswers(sortIt);
  }, [value, data]);

  if (!data?.length) {
    return <></>;
  }

  return (
    <>
      <Group mb="md" justify="space-between">
        <Stack>
          <Text
            fw={700}
            fz="lg"
            dangerouslySetInnerHTML={{ __html: String(data?.[0]?.question) }}
          />
          <Group>
            <Text c="dimmed" size={rem(14)}>
              Asked {dayjs(data?.[0]?.createdAt).fromNow()}
            </Text>
            <Text c="dimmed" size={rem(14)}>
              Modified {dayjs(data?.[0]?.updatedAt).fromNow()}
            </Text>
            <Text c="dimmed" size={rem(14)}>
              Viewed {data?.[0]?.views?.length} times
            </Text>
          </Group>
        </Stack>
        <Button onClick={open}>Ask Question</Button>
      </Group>
      <Divider mb="md" />
      <Stack gap="xl">
        <Forum forum={data?.[0]} refetch={refetch} />
        <Divider variant="dashed" />
        <Group gap={0} wrap="nowrap" justify="space-between">
          <Text fw={700} size="lg">
            {data?.[1]?.length} Answers
          </Text>
          <Select
            data={FORUM_ANSWERS_SORT_OPTIONS}
            allowDeselect={false}
            value={value}
            onChange={setValue}
            placeholder="Sort by"
          />
        </Group>
        {answers?.map((forum: ForumType) => (
          <Forum key={String(forum._id)} forum={forum} refetch={refetch} />
        ))}
        <ReplyToQuestion refetch={refetch} parent={data[0]?._id} />
      </Stack>
      <AskQuestion opened={opened} close={close} />
    </>
  );
};

export default ForumPage;
