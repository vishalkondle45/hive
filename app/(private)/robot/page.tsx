'use client';

import { useMemo } from 'react';
import { Center, Container, Paper, SimpleGrid, Stack, Text, ThemeIcon, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { nprogress } from '@mantine/nprogress';
import { IconRobot } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { NewPrompt } from '@/components/Robot';
import { apiCall, getRandomElements } from '@/lib/client_functions';
import { promptExamples } from '@/lib/constants';

const Page = () => {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1000px)');

  const form = useForm({
    initialValues: {
      prompt: '',
    },
    validate: {
      prompt: (value) => (value ? null : 'This field is required.'),
    },
  });

  const visibleTodos = useMemo(() => getRandomElements(promptExamples), []);

  const sendMessage = async (prompt: string) => {
    if (prompt === '') {
      form.setFieldError('prompt', 'This field is required.');
      return;
    }
    nprogress.start();
    const response = await apiCall('/api/robot', { prompt }, 'POST', () => router.push('/'));
    router.push(`/robot/prompts/${response?.data._id}`);
    nprogress.complete();
  };

  return (
    <Container px={0} size="md">
      <NewPrompt form={form} sendMessage={sendMessage} />
      <Center w="100%" h={500}>
        <Stack align="center">
          <ThemeIcon color="gray" variant="transparent" size={rem(100)}>
            <IconRobot style={{ width: rem(100), height: rem(100) }} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text c="teal" size="xl">
              Hello, Vishal
            </Text>
            <Text size="xl">How can I help you today?</Text>
          </Stack>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" verticalSpacing="sm">
            {visibleTodos?.slice(0, isDesktop ? 4 : 2).map((prompt) => (
              <Paper
                radius="md"
                w="100%"
                p="sm"
                withBorder
                onClick={() => sendMessage(prompt.prompt)}
                style={{ cursor: 'pointer' }}
                key={prompt.header}
              >
                <Text style={{ whiteSpace: 'nowrap', overflow: 'hidden' }} fw={700}>
                  {prompt.header}
                </Text>
                <Text c="gray">{prompt.subheader}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      </Center>
    </Container>
  );
};

export default Page;
