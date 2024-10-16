'use client';

import { ActionIcon, Button, Group, Paper, Stack, Text, Title, rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { error } from '@/utils/functions';
import { setLoading } from '@/store/features/commonSlice';
import { useAppDispatch } from '@/store/features/hooks';
import { deleteAllChats, deleteChat, getAllChats } from '@/services/Robot.service';

interface ChatType {
  _id: string;
  title: string;
}

const Page = () => {
  const dispatch = useAppDispatch();
  const [titles, setTitles] = useState<ChatType[]>([]);
  const router = useRouter();

  const getChatsList = async () => {
    dispatch(setLoading(true));
    speechSynthesis.cancel();
    try {
      const res = await getAllChats();
      setTitles(res.data);
    } catch (err) {
      error({ message: 'Failed to load chats.' });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getChatsList();
  }, []);

  const onDeleteChat = async (_id: string) => {
    dispatch(setLoading(true));
    speechSynthesis.cancel();
    try {
      await deleteChat(_id);
      setTitles(titles.filter((item) => item._id !== _id));
    } catch (err) {
      error({ message: 'Failed to delete chat.' });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteAll = async () => {
    dispatch(setLoading(true));
    speechSynthesis.cancel();
    try {
      await deleteAllChats();
      setTitles([]);
    } catch (err) {
      error({ message: 'Failed to delete chats.' });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">All the titles history will be deleted.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: deleteAll,
    });

  return (
    <>
      <Group mb="md" justify="space-between">
        <Text fz={rem(30)} fw={700}>
          Chats
        </Text>
        <Button disabled={!titles.length} leftSection={<IconTrash />} onClick={openModal}>
          Delete All
        </Button>
      </Group>
      <Stack>
        {titles.length ? (
          titles.map((chat) => (
            <Paper withBorder p="md" key={chat?._id}>
              <Group justify="space-between" wrap="nowrap">
                <Text lineClamp={2} fw={500} size="sm">
                  {chat?.title}
                </Text>
                <Group wrap="nowrap">
                  <ActionIcon
                    color="blue"
                    variant="transparent"
                    onClick={() => router.push(`/robot/chats/${chat?._id}`)}
                  >
                    <IconEye />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    variant="transparent"
                    onClick={() => onDeleteChat(chat?._id)}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))
        ) : (
          <Title order={1} ta="center">
            No chats found...
          </Title>
        )}
      </Stack>
    </>
  );
};

export default Page;
