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

export const openModal = (message: string, onConfirm: () => void) =>
  modals.openConfirmModal({
    title: 'Please confirm your action',
    children: <Text size="sm">{message}</Text>,
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    confirmProps: { color: 'red' },
    onConfirm,
  });

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
  } catch (error: any) {
    failure(error?.response?.data.error || 'Error while calling API');
  } finally {
    nprogress.complete();
  }
  return res;
};

export const getInitials = (name: string | undefined | null) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('');
