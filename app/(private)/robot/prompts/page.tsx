'use client';

import { ActionIcon, Button, Container, Group, Paper, Stack, Text, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { nprogress } from '@mantine/nprogress';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall } from '@/lib/client_functions';
import { setPrompts } from '@/store/features/robotSlice';
import { RootState } from '@/store/store';

const Page = () => {
  const { prompts } = useSelector((state: RootState) => state.robot);
  const dispatch = useDispatch();
  const router = useRouter();

  const getPromptsList = async () => {
    nprogress.start();
    const res = await apiCall('/api/robot/prompts/list', null, 'GET', () => router.push('/robot'));
    dispatch(setPrompts(res?.data));
    nprogress.complete();
  };

  useEffect(() => {
    getPromptsList();
  }, []);

  const deletePrompt = async (_id: string) => {
    nprogress.start();
    await apiCall(`/api/robot/prompts/${_id}`, null, 'DELETE');
    getPromptsList();
    nprogress.complete();
  };

  const deleteAllPrompts = async () => {
    nprogress.start();
    await apiCall('/api/robot', null, 'DELETE');
    dispatch(setPrompts([]));
    nprogress.complete();
    router.push('/robot');
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">All the prompts history will be deleted.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: deleteAllPrompts,
    });

  return (
    <Container px={0} size="md">
      <Group mb="md" justify="space-between">
        <Text fz={rem(28)} fw={700}>
          Prompts
        </Text>
        <Button color="red" leftSection={<IconTrash />} size="compact-md" onClick={openModal}>
          Delete All
        </Button>
      </Group>
      <Stack>
        {prompts?.map((prompt) => (
          <Paper withBorder p="md" key={prompt?._id}>
            <Group justify="space-between" wrap="nowrap">
              <Text>{prompt?.prompt}</Text>
              <Group wrap="nowrap">
                <ActionIcon
                  color="blue"
                  variant="transparent"
                  onClick={() => router.push(`/robot/prompts/${prompt?._id}`)}
                >
                  <IconEye />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  variant="transparent"
                  onClick={() => deletePrompt(prompt?._id)}
                >
                  <IconTrash />
                </ActionIcon>
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default Page;
