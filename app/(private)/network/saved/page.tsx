'use client';

import { Container, Group, Stack, Title } from '@mantine/core';
import { useFetch } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { Post } from '@/components/Network/Post';

const NetworkPage = () => {
  const { data: posts, refetch } = useFetch('/api/network/posts/save');
  const session: any = useSession();

  return (
    <Container px={0} size="md">
      <Group mb="md" justify="space-between">
        <Title order={3}>Saved Posts</Title>
      </Group>
      <Container mt="md" px={0} size="xs">
        {Array.isArray(posts) && (
          <Stack>
            {posts?.map((post) => (
              <Post
                key={String(post?._id)}
                post={post}
                refetch={refetch}
                user={session.data?.user?._id}
              />
            ))}
          </Stack>
        )}
      </Container>
    </Container>
  );
};

export default NetworkPage;
