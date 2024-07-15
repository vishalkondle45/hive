'use client';

import { Center, Container, Image, Modal, Paper, SimpleGrid, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ProfileInfo } from '@/components/Network';
import { apiCall, failure } from '@/lib/client_functions';

const ProfilePage = ({ params: { username } }: { params: { username: string } }) => {
  const [opened, setOpened] = useState(0);
  const [profile, setProfile] = useState<any>();

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

  // if (!profile) return <></>;

  return (
    <Container px={0} size="md">
      <ProfileInfo username={username} profile={profile} />
      {Array.isArray(profile?.posts) && (
        <Paper p="md" mt="lg" withBorder>
          {profile.length ? (
            <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
              {profile?.posts.map((i: any) => (
                <Image
                  key={i}
                  src={`https://picsum.photos/id/${i}1/200/200`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpened(i)}
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
      <Modal size="md" opened={!!opened} onClose={() => setOpened(0)}>
        <Image src={`https://picsum.photos/id/${opened}1/200/200`} />
      </Modal>
    </Container>
  );
};
export default ProfilePage;
