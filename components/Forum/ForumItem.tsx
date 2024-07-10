import { Avatar, Badge, Flex, Group, Paper, rem, Stack, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { ForumType } from './Forum.types';

interface Props {
  forum: ForumType;
  isMobile?: boolean;
  selectedTag?: string;
}

export const ForumItem = ({ forum, isMobile, selectedTag }: Props) => {
  const router = useRouter();
  return (
    <>
      <Paper
        p="md"
        style={{ cursor: 'pointer' }}
        onClick={() => router.push(`/forum/${forum?._id}`)}
        withBorder
      >
        <Flex direction={isMobile ? 'column' : 'row'} wrap="nowrap" gap={rem(12)}>
          <Flex
            direction={isMobile ? 'row' : 'column'}
            justify="space-between"
            gap={rem(6)}
            align="end"
          >
            <Badge radius="xs" variant="transparent" px={0}>
              {(forum.upvotes?.length || 0) - (forum.downvotes?.length || 0)} votes
            </Badge>
            <Badge
              radius="xs"
              variant="filled"
              leftSection={<IconCheck style={{ width: rem(18), height: rem(18) }} />}
              color="teal"
            >
              {forum?.answers} answers
            </Badge>
            <Badge radius="xs" color="brown" variant="transparent" px={0}>
              {forum?.views?.length} views
            </Badge>
          </Flex>
          <Stack w="100%">
            <Text>{forum?.question}</Text>
            <Group justify="space-between">
              <Group>
                {forum?.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    size="sm"
                    color={tag === selectedTag ? '' : 'gray.1'}
                    c={tag === selectedTag ? 'white' : 'dark'}
                    radius="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/forum/tagged/${tag}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {tag}
                  </Badge>
                ))}
              </Group>
              <Group wrap="nowrap" gap={rem(6)} justify="right">
                <Avatar size="sm" name={forum?.user?.name} color="initials" />
                <Text ta="right" inline c="dimmed" size="sm">
                  <Text c="dark" span>
                    {forum?.user?.name?.slice(0, 20)}
                  </Text>{' '}
                  asked {dayjs(forum?.createdAt).fromNow()}
                </Text>
              </Group>
            </Group>
          </Stack>
        </Flex>
      </Paper>
    </>
  );
};
