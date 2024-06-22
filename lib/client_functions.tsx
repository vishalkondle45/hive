import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';

export const failure = (message: string) =>
  notifications.show({
    title: 'Error',
    message,
    color: 'red',
    autoClose: 5000,
    withCloseButton: true,
    icon: <IconX />,
  });

export const success = (message: string) =>
  notifications.show({
    title: 'Success',
    message,
    color: 'green',
    autoClose: 5000,
    withCloseButton: true,
    icon: <IconCheck />,
  });

export const openModal = (onConfirm: () => void) =>
  modals.openConfirmModal({
    title: 'Please confirm your action',
    children: (
      <Text size="sm">
        This action is so important that you are required to confirm it with a modal. Please click
        one of these buttons to proceed.
      </Text>
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    confirmProps: { color: 'red' },
    onConfirm,
  });

export const updateTodo = async (_id: string, data: any) => {
  const res = await axios.put('/api/todos', { ...data, _id });
  return res;
};
