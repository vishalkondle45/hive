'use client';

import { Container, rem, Stack, Title } from '@mantine/core';
import NewChat from '@/components/Robot/NewChat';
import { useResponsiveness } from '@/hooks/useResponsiveness';

const Page = () => {
  const { isDesktop } = useResponsiveness();

  return (
    <Container
      pb="xl"
      style={isDesktop ? {} : { bottom: 0, position: 'fixed' }}
      px={0}
      mt={rem('30vh')}
    >
      <Stack>
        <Title ta="center" order={1}>
          What can I help with?
        </Title>
        <NewChat />
      </Stack>
    </Container>
  );
};

export default Page;
