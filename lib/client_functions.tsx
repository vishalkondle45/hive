import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

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
