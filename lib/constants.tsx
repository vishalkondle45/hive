import {
  IconCalendar,
  IconCheckbox,
  IconClipboardText,
  IconCloud,
  IconCode,
  IconLock,
  IconMessageQuestion,
  IconMessages,
  IconNote,
  IconWallet,
} from '@tabler/icons-react';

export const APPS = [
  { label: 'Notes', path: '/notes', icon: <IconNote />, color: 'blue' },
  { label: 'Todos', path: '/todos', icon: <IconCheckbox />, color: 'red' },
  { label: 'Calendar', path: '/calendar', icon: <IconCalendar />, color: 'green' },
  { label: 'Forum', path: '/forum', icon: <IconMessageQuestion />, color: 'indigo' },
  { label: 'Passwords', path: '/passwords', icon: <IconLock />, color: 'teal' },
  { label: 'Document', path: '/document', icon: <IconClipboardText />, color: 'violet' },
  { label: 'Chat', path: '/chat', icon: <IconMessages />, color: 'pink' },
  { label: 'Drive', path: '/drive', icon: <IconCloud />, color: 'cyan' },
  { label: 'Wallet', path: '/wallet', icon: <IconWallet />, color: 'grape' },
  { label: 'Dev Tools', path: '/dev', icon: <IconCode />, color: 'lime' },
];
