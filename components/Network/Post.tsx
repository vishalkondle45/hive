import React from 'react';
import { ActionIcon, Card, Group, Image, Spoiler, Text } from '@mantine/core';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconDotsVertical,
  IconHeart,
  IconHeartFilled,
} from '@tabler/icons-react';

export const Post = ({
  post,
  onLike,
  onSave,
  user,
}: {
  post: any;
  onLike?: (_id: string) => void;
  onSave?: (_id: string) => void;
  user: string | undefined | null;
}) => (
  <>
    <Card shadow="sm" p={0}>
      <Group justify="space-between" p="xs">
        <Image src={post?.user?.image} h={42} w={42} radius="50%" />
        <Text fw={700}>{post?.user?.username}</Text>
        <ActionIcon variant="transparent">
          <IconDotsVertical />
        </ActionIcon>
      </Group>
      <Card.Section>
        <Image src={post?.url} />
      </Card.Section>
      <Group p="xs" pb={0} justify="space-between">
        <Group gap="md">
          <ActionIcon onClick={() => onLike?.(post?._id)} variant="transparent">
            {post.likes?.includes(user) ? <IconHeartFilled /> : <IconHeart />}
          </ActionIcon>
          <Text size="sm">{post?.likes?.length || 0} likes</Text>
        </Group>
        <ActionIcon onClick={() => onSave?.(post?._id)} variant="transparent">
          {post.saved?.includes(user) ? <IconBookmarkFilled /> : <IconBookmark />}
        </ActionIcon>
      </Group>
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
    </Card>
  </>
);
