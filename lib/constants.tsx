import {
  IconArchive,
  IconCalendar,
  IconCheckbox,
  IconClipboardText,
  IconCloud,
  IconCode,
  IconLock,
  IconMessageQuestion,
  IconMessages,
  IconNote,
  IconTrash,
  IconWallet,
} from '@tabler/icons-react';

export const APPS = [
  {
    label: 'Notes',
    path: '/notes',
    icon: <IconNote />,
    color: 'blue',
    sidebar: [
      { label: 'Notes', path: '/notes', icon: <IconNote /> },
      { label: 'Archived', path: '/notes/archive', icon: <IconArchive /> },
      { label: 'Trashed', path: '/notes/trashed', icon: <IconTrash /> },
    ],
  },
  {
    label: 'Todos',
    path: '/todos',
    icon: <IconCheckbox />,
    color: 'red',
    sidebar: [],
  },
  { label: 'Calendar', path: '/calendar', icon: <IconCalendar />, color: 'green', sidebar: [] },
  { label: 'Forum', path: '/forum', icon: <IconMessageQuestion />, color: 'indigo', sidebar: [] },
  { label: 'Passwords', path: '/passwords', icon: <IconLock />, color: 'teal', sidebar: [] },
  {
    label: 'Document',
    path: '/document',
    icon: <IconClipboardText />,
    color: 'violet',
    sidebar: [],
  },
  { label: 'Chat', path: '/chat', icon: <IconMessages />, color: 'pink', sidebar: [] },
  { label: 'Drive', path: '/drive', icon: <IconCloud />, color: 'cyan', sidebar: [] },
  { label: 'Wallet', path: '/wallet', icon: <IconWallet />, color: 'grape', sidebar: [] },
  { label: 'Dev Tools', path: '/dev', icon: <IconCode />, color: 'lime', sidebar: [] },
];

export const COLORS = [
  'blue',
  'red',
  'green',
  'indigo',
  'teal',
  'violet',
  'pink',
  'cyan',
  'grape',
  'lime',
];
