'use client';

import { Container } from '@mantine/core';
import { ProfileInfo } from '@/components/Network';

const ProfilePage = ({ params: { username } }: { params: { username: string } }) => (
  <Container px={0} size="md">
    <ProfileInfo username={String(username)} />
  </Container>
);

export default ProfilePage;
