'use client';

import { Center, Container, Image, Modal, Paper, SimpleGrid, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProfileInfo } from '@/components/Network';
import { apiCall, failure } from '@/lib/client_functions';
import { Post } from '@/components/Network/Post';

const ProfilePage = ({ params: { username } }: { params: { username: string } }) => {
  const [opened, setOpened] = useState(0);
  const [profile, setProfile] = useState<any>();
  const session: any = useSession();

  const getProfile = async () => {
    await apiCall(`/api/profile?username=${username}`)
      .then((res) => setProfile({ ...res?.data, dob: new Date(res?.data.user.dob) }))
      .catch((error) => {
        failure(error.response.data.error);
      });
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (!profile) return <></>;

  return (
    <Container px={0} size="md">
      <ProfileInfo username={username} profile={profile} />
      {Array.isArray(profile?.posts) && (
        <Paper p="md" mt="lg" withBorder>
          {profile?.posts?.length ? (
            <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
              {profile?.posts?.map((post: any) => (
                <Image
                  key={String(post?._id)}
                  src={post?.url}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpened(post?._id)}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Center>
              <Title>No Posts found</Title>
            </Center>
          )}
        </Paper>
      )}
      {Array.isArray(profile?.posts) && profile?.posts?.length && (
        <Modal
          size="md"
          styles={{ body: { padding: 0 } }}
          opened={!!opened}
          onClose={() => setOpened(0)}
          withCloseButton={false}
        >
          <Post
            post={profile?.posts?.find((post: any) => post?._id === opened)}
            user={session?.data?.user._id}
            refetch={() => getProfile()}
          />
        </Modal>
      )}
    </Container>
  );
};
export default ProfilePage;
