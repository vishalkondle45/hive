import { Image, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { nprogress } from '@mantine/nprogress';
import {
  IconBrandReact,
  IconCheck,
  IconFile,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconFileZip,
  IconMusic,
  IconPhoto,
  IconVideo,
  IconX,
} from '@tabler/icons-react';
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

    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'svg':
      return <Image alt={url} src={url} h="auto" w="auto" fit="contain" />;

    default:
      return url;
  }
};

export const fileIcon = (url: string) => {
  if (!url) return <></>;
  switch (url.toLowerCase().split('?')[0].split('.').at(-1)) {
    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'svg':
      return <IconPhoto size={18} />;
    case 'pdf':
      return <IconFileTypePdf size={18} />;
    case 'doc':
    case 'docs':
    case 'docx':
      return <IconFileTypeDoc size={18} />;
    case 'mp3':
      return <IconMusic size={18} />;
    case 'mp4':
      return <IconVideo size={18} />;
    case 'tsx':
    case 'jsx':
      return <IconBrandReact size={18} />;
    case 'zip':
    case 'rar':
      return <IconFileZip size={18} />;
    default:
      return <IconFile size={18} />;
  }
};

export function getRandomElements(arr: any[]) {
  return arr.sort(() => Math.random() - 0.5);
}

export const textToSpeech = (
  string: string,
  open: () => void = () => {},
  close: () => void = () => {}
) => {
  if (window.speechSynthesis.speaking) {
    speechSynthesis.cancel();
    close();
  } else {
    open();
    const msg = new SpeechSynthesisUtterance(string);
    const [voice] = speechSynthesis.getVoices();
    msg.voice = voice;
    msg.lang = 'en-IN';
    window.speechSynthesis.speak(msg);
    window.onbeforeunload = (e) => {
      if (window.speechSynthesis.speaking) {
        e.preventDefault();
        msg.addEventListener('end', () => {
          speechSynthesis.cancel();
          close();
        });
      }
    };
    msg.onend = () => {
      speechSynthesis.cancel();
      close();
    };
  }
};

export const renderBoldText = (text: string) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  return text.split(boldRegex);
};

export const sumOfDigits = (n: string) =>
  n
    .charCodeAt(0)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);
