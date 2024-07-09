import { Avatar, Badge, Button, Divider, Group, Paper, rem, Stack, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import { IconMessageReply, IconQuestionMark } from '@tabler/icons-react';
import { ForumType } from './Forum.types';
import { apiCall, openModal } from '@/lib/client_functions';

dayjs.extend(relativeTime);

interface Props {
  forum: ForumType;
}

export const Forum = ({ forum }: Props) => {
  const session: any = useSession();
  const router = useRouter();

  const onDelete = () =>
    openModal('This forum will be deleted permanently', () => {
      apiCall(`/api/forums?_id=${forum?._id}`, {}, 'DELETE').then(() => {
        router.push('/forum');
      });
    });

  return (
    <Paper p="lg" withBorder>
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
        <Divider />
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
            <Button variant="transparent" color="gray" size="compact-xs">
              Share
            </Button>
            {session.data.user._id === forum?.user?._id && (
              <>
                <Button variant="transparent" color="gray" size="compact-xs">
                  Edit
                </Button>
                <Button variant="transparent" color="gray" size="compact-xs" onClick={onDelete}>
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
                asked {dayjs(forum?.createdAt).format('MMM DD YYYY @ HH:mm')}
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
                        <IconQuestionMark stroke={4} style={{ width: rem(14), height: rem(14) }} />
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
                        <IconMessageReply stroke={3} style={{ width: rem(14), height: rem(14) }} />
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
    </Paper>
  );
};
