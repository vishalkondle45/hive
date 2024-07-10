'use client';

import { useEffect, useState } from 'react';
import { Button, Divider, Group, rem, Select, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { Forum, AskQuestion, ReplyToQuestion } from '@/components/Forum';
import { ForumType } from '@/components/Forum/Forum.types';
import { FORUM_ANSWERS_SORT_OPTIONS } from '@/lib/constants';
import { ForumDocument } from '@/models/Forum';
import { apiCall } from '@/lib/client_functions';

const ForumPage = ({ params }: { params: { forum: string } }) => {
  const [forum, setForum] = useState<ForumDocument | null | any>(null);
  const [answers, setAnswers] = useState<ForumType[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<string | null>('highest');

  const getForum = async () => {
    const res: any | undefined = await apiCall(`/api/forums?_id=${params.forum}`);
    if (res?.data) {
      setForum(res?.data?.[0]);
      setAnswers(res?.data?.[1]);
    }
  };

  useEffect(() => {
    getForum();
  }, [params.forum]);

  useEffect(() => {
    if (!forum || !answers) {
      return;
    }
    const sortIt = [...answers];
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
  }, [value]);

  return (
    <>
      <Group mb="md" justify="space-between">
        <Stack>
          <Text fw={700} fz="lg" dangerouslySetInnerHTML={{ __html: String(forum?.question) }} />
          <Group>
            <Text c="dimmed" size={rem(14)}>
              Asked {dayjs(forum?.createdAt).fromNow()}
            </Text>
            <Text c="dimmed" size={rem(14)}>
              Modified {dayjs(forum?.updatedAt).fromNow()}
            </Text>
            <Text c="dimmed" size={rem(14)}>
              Viewed {forum?.views?.length} times
            </Text>
          </Group>
        </Stack>
        <Button onClick={open}>Ask Question</Button>
      </Group>
      <Divider mb="md" />
      <Stack gap="md">
        <Forum forum={forum} refetch={getForum} />
        <Divider variant="dashed" />
        <Group gap={0} wrap="nowrap" justify="space-between">
          <Text fw={700} size="lg">
            {answers?.length} Answers
          </Text>
          <Select
            data={FORUM_ANSWERS_SORT_OPTIONS}
            allowDeselect={false}
            value={value}
            onChange={setValue}
            placeholder="Sort by"
          />
        </Group>
        {answers?.map((forumItem: ForumType) => (
          <Forum key={String(forumItem._id)} forum={forumItem} refetch={getForum} />
        ))}
        <ReplyToQuestion refetch={getForum} parent={forum?._id} />
      </Stack>
      <AskQuestion opened={opened} close={close} />
    </>
  );
};

export default ForumPage;
