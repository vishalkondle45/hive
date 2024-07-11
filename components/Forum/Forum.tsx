import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Paper,
  rem,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCheck,
} from '@tabler/icons-react';
import { ForumType } from './Forum.types';
import { apiCall, openModal } from '@/lib/client_functions';

dayjs.extend(relativeTime);

interface Props {
  forum: ForumType;
  refetch: () => void;
  answer?: string;
  onMarkAsAnswer?: (answer: string | null) => void;
}

export const Forum = ({ forum, refetch, answer, onMarkAsAnswer }: Props) => {
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

  const isThisAnswer = forum._id === answer;

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
          {!forum?.question && isThisAnswer && (
            <Tooltip label="Verified Answer">
              <ThemeIcon radius="xl" color="green" variant="transparent">
                <IconCheck stroke={5} />
              </ThemeIcon>
            </Tooltip>
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
                  <Button variant="transparent" color="red" size="compact-xs" onClick={onDelete}>
                    Delete
                  </Button>
                  <Button variant="transparent" color="blue" size="compact-xs">
                    Edit
                  </Button>
                </>
              )}
              {session.data.user._id !== forum?.user?._id && (
                <Button variant="transparent" color="gray" size="compact-xs">
                  Follow
                </Button>
              )}
              {!forum?.question && forum?.user?._id === session.data.user._id && (
                <Tooltip label={`${isThisAnswer ? 'Remove as answer' : 'Mark as answer'}`}>
                  <Button
                    variant="transparent"
                    color={isThisAnswer ? 'red' : 'teal'}
                    size="compact-xs"
                    onClick={() => onMarkAsAnswer?.(isThisAnswer ? null : String(forum._id))}
                  >
                    {isThisAnswer ? 'Remove' : 'Mark'} as Answer
                  </Button>
                </Tooltip>
              )}
            </Group>
            <Paper p="xs" withBorder>
              <Group wrap="nowrap" gap={rem(4)}>
                <Avatar name={forum?.user?.name} color="initials" />
                <Stack gap={rem(4)}>
                  <Text size="xs">{forum?.user?.name}</Text>
                  <Text c="dimmed" size={rem(12)}>
                    {dayjs(forum?.createdAt).format('MMM DD YYYY @ HH:mm')}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
};
