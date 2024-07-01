import { Image, Text } from '@mantine/core';
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

export const apiCall = async (url: string, body?: any, method: string = 'GET', cb?: () => void) => {
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
    // apiCall(url, body, method);
    if (cb) cb();
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

export const Preview = (url: string) => {
  if (!url) return <></>;
  switch (url.split('?')[0].split('.').at(-1)) {
    case 'pdf':
    case 'docs':
    case 'doc':
      return (
        <iframe
          title={url}
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${url}`}
          style={{ width: '100%', height: '100%' }}
        />
      );
    case 'mp3':
      return (
        <audio autoPlay title={url} src={url} controls>
          <track kind="captions" srcLang="en" src="captions.vtt" />
        </audio>
      );

    case 'mp4':
      return (
        <video autoPlay title={url} src={url} controls>
          <track kind="captions" srcLang="en" src="captions.vtt" />
        </video>
      );
    default:
      return <Image alt={url} src={url} h="auto" w="auto" fit="contain" />;
  }
};
