import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { nprogress } from '@mantine/nprogress';
import { IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';

export const failure = (message: string) =>
  notifications.show({
    title: 'Error',
    message,
    color: 'red',
    autoClose: 2000,
    withCloseButton: true,
    icon: <IconX />,
  });

export const success = (message: string) =>
  notifications.show({
    title: 'Success',
    message,
    color: 'green',
    autoClose: 2000,
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

export const apiCall = async (url: string, body?: any, method: string = 'GET') => {
  let res;
  nprogress.start();
  try {
    switch (method) {
      case 'GET':
        res = await axios.get(url);
        break;
      case 'POST':
        res = await axios.post(url, body);
        break;
      case 'PUT':
        res = await axios.put(url, body);
        break;
      case 'DELETE':
        res = await axios.delete(url, body);
        break;
      default:
        break;
    }
  } catch (error) {
    failure('Error while calling API');
  } finally {
    nprogress.complete();
  }
  return res;
};
