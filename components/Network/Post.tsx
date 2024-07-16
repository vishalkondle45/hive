import React from 'react';
import { ActionIcon, Avatar, Card, Group, Image, Paper, Spoiler, Text } from '@mantine/core';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconHeart,
  IconHeartFilled,
  IconTrash,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { apiCall, failure, openModal } from '@/lib/client_functions';

type Props = {
  post: any;
  user: string | undefined | null;
  refetch: () => void;
};

export const Post = ({ post, user, refetch }: Props) => {
  const router = useRouter();
  const onLike = async (_id: string) => {
    await apiCall(`/api/network/posts/like?_id=${_id}`, null, 'PUT')
      .then(refetch)
      .catch((error) => failure(error.response.data.error));
  };
  const onSave = async (_id: string) => {
    await apiCall(`/api/network/posts/save?_id=${_id}`, null, 'PUT')
      .then(refetch)
      .catch((error) => failure(error.response.data.error));
  };
  const onDelete = (_id: string) => {
    openModal('Are you sure you want to delete this post?', async () => {
      await apiCall(`/api/network/posts?_id=${_id}`, null, 'DELETE')
        .then(refetch)
        .catch((error) => failure(error.response.data.error));
    });
  };

  return (
    <>
      <Card shadow="xl" p={0}>
        <Paper radius={0} shadow="xs" p="xs" withBorder>
          <Group justify="space-between">
            <Group>
              <Avatar
                onClick={() => router.push(`/network/${post?.user?.username}`)}
                name={post?.user?.name}
                src={post?.user?.image}
                color="initials"
                style={{ cursor: 'pointer' }}
              />
              <Text fw={700}>{post?.user?.username}</Text>
            </Group>
            {user === post?.user?._id && (
              <ActionIcon color="red" variant="transparent" onClick={() => onDelete?.(post?._id)}>
                <IconTrash />
              </ActionIcon>
            )}
          </Group>
        </Paper>
        <Card.Section>
          <Image src={post?.url} />
        </Card.Section>
        <Paper radius={0} shadow="xs" p="sm" withBorder>
          <Group justify="space-between">
            <Group gap="md">
              <ActionIcon onClick={() => onLike?.(post?._id)} variant="transparent">
                {post?.likes?.includes(user) ? <IconHeartFilled /> : <IconHeart />}
              </ActionIcon>
              <Text size="sm" fw={700}>
                {post?.likes?.length || 0} likes
              </Text>
            </Group>
            <ActionIcon onClick={() => onSave?.(post?._id)} variant="transparent">
              {post?.saved?.includes(user) ? <IconBookmarkFilled /> : <IconBookmark />}
            </ActionIcon>
          </Group>
        </Paper>
        {post?.caption && (
          <Paper radius={0} withBorder>
            <Spoiler
              maxHeight={50}
              showLabel={
                <Text size="sm" px="xs">
                  Show more
                </Text>
              }
              hideLabel={
                <Text size="sm" px="xs">
                  Hide
                </Text>
              }
            >
              <Text size="sm" p="xs">
                {post?.caption}
              </Text>
            </Spoiler>
          </Paper>
        )}
      </Card>
    </>
  );
};
