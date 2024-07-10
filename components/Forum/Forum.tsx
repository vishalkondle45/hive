import { ActionIcon, Avatar, Badge, Button, Group, Paper, rem, Stack, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconMessageReply,
  IconQuestionMark,
} from '@tabler/icons-react';
import { ForumType } from './Forum.types';
import { apiCall, openModal } from '@/lib/client_functions';

dayjs.extend(relativeTime);

interface Props {
  forum: ForumType;
  refetch: () => void;
}

export const Forum = ({ forum, refetch }: Props) => {
  const session: any = useSession();
  const router = useRouter();

  // check if user is upvoted or downvoted
  const isUpVoted = forum?.upvotes?.includes(session?.data?.user?._id);
  const isDownVoted = forum?.downvotes?.includes(session?.data?.user?._id);
  const isSaved = forum?.saved?.includes(session?.data?.user?._id);

  // remove user from upvotes and downvotes
  const removeFromUpVotes = forum?.upvotes?.filter((_id) => _id !== session?.data?.user?._id);
  const removeFromDownVotes = forum?.downvotes?.filter((_id) => _id !== session?.data?.user?._id);
  const removeFromSaved = forum?.saved?.filter((_id) => _id !== session?.data?.user?._id);

  const onDelete = () =>
    openModal('This forum will be deleted permanently', () => {
      apiCall(`/api/forums?_id=${forum?._id}`, {}, 'DELETE').then(() => {
        if (forum?.question) {
          router.push('/forum');
        } else {
          refetch();
        }
      });
    });

  const onUpVote = async () => {
    const body = { ...forum };
    if (isDownVoted) {
      body.downvotes = removeFromDownVotes;
    } else {
      body.upvotes = [...forum.upvotes, session?.data?.user?._id];
    }
    await apiCall('/api/forums', body, 'PUT');
    refetch();
  };

  const onDownVote = async () => {
    const body = { ...forum };
    if (isUpVoted) {
      body.upvotes = removeFromUpVotes;
    } else {
      body.downvotes = [...forum.downvotes, session?.data?.user?._id];
    }
    await apiCall('/api/forums', body, 'PUT');
    refetch();
  };

  const onBookmark = async () => {
    const body = { ...forum };
    if (isSaved) {
      body.saved = removeFromSaved;
    } else {
      body.saved = [...forum.saved, session?.data?.user?._id];
    }
    await apiCall('/api/forums', body, 'PUT');
    refetch();
  };

  if (!forum) return <></>;

  return (
    <Paper p="md" withBorder>
      <Group wrap="nowrap" align="flex-start">
        <Stack align="center">
          <ActionIcon
            disabled={isUpVoted}
            onClick={onUpVote}
            radius="xl"
            variant="filled"
            color="teal"
          >
            <IconCaretUpFilled />
          </ActionIcon>
          <Text fw={700}>{(forum?.upvotes?.length || 0) - (forum?.downvotes?.length || 0)}</Text>
          <ActionIcon
            disabled={isDownVoted}
            onClick={onDownVote}
            radius="xl"
            variant="filled"
            color="red"
          >
            <IconCaretDownFilled />
          </ActionIcon>
          {forum?.question && (
            <ActionIcon onClick={onBookmark} radius="xl" variant="transparent">
              {isSaved ? <IconBookmarkFilled /> : <IconBookmark />}
            </ActionIcon>
          )}
        </Stack>
        <Stack w="100%">
          <Text dangerouslySetInnerHTML={{ __html: String(forum?.description) }} />
          <Group>
            {forum?.tags?.map((tag) => (
              <Badge
                size="sm"
                key={tag}
                color="gray.5"
                radius="xs"
                onClick={() => router.push(`/forum/tagged/${tag}`)}
                style={{ cursor: 'pointer' }}
              >
                {tag}
              </Badge>
            ))}
          </Group>
          <Group align="baseline" justify="space-between">
            <Group gap={rem(2)}>
              <Button variant="transparent" color="teal" size="compact-xs">
                Share
              </Button>
              {session.data.user._id === forum?.user?._id && (
                <>
                  <Button variant="transparent" color="blue" size="compact-xs">
                    Edit
                  </Button>
                  <Button variant="transparent" color="red" size="compact-xs" onClick={onDelete}>
                    Delete
                  </Button>
                </>
              )}
              {session.data.user._id !== forum?.user?._id && (
                <Button variant="transparent" color="gray" size="compact-xs">
                  Follow
                </Button>
              )}
            </Group>
            <Paper p="xs" withBorder>
              <Stack gap={rem(4)}>
                <Text c="dimmed" size={rem(12)}>
                  {forum?.question ? 'asked' : 'answered'} on{' '}
                  {dayjs(forum?.createdAt).format('MMM DD YYYY @ HH:mm')}
                </Text>
                <Group gap={rem(4)}>
                  <Avatar name={forum?.user?.name} color="initials" />
                  <Stack gap={rem(4)}>
                    <Text size="xs">{forum?.user?.name}</Text>
                    <Group gap="xs">
                      <Badge
                        variant="light"
                        color="red"
                        radius="xs"
                        title="Questions"
                        leftSection={
                          <IconQuestionMark
                            stroke={4}
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        0
                      </Badge>
                      <Badge
                        variant="light"
                        color="teal"
                        radius="xs"
                        title="Replies"
                        leftSection={
                          <IconMessageReply
                            stroke={3}
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        0
                      </Badge>
                    </Group>
                  </Stack>
                </Group>
              </Stack>
            </Paper>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
};
