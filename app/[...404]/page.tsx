'use client';

import { Box, Center, rem, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconError404 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  return (
    <Box>
      <Center h="70vh">
        <Stack gap="xs" align="center">
          <ThemeIcon variant="transparent" size={rem(200)}>
            <IconError404 style={{ width: rem(200), height: rem(200) }} />
          </ThemeIcon>
          <Text ta="center" fw={500} size={rem(16)}>
            <Text
              span
              c="blue"
              fw={700}
              style={{ cursor: 'pointer' }}
              onClick={() => router.push('/')}
            >
              Click here
            </Text>
            , to go home
          </Text>
        </Stack>
      </Center>
    </Box>
  );
};

export default Page;
