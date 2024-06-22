import {
  IconArchive,
  IconCalendar,
  IconCalendarEvent,
  IconCheckbox,
  IconClipboardText,
  IconCloud,
  IconCode,
  IconLock,
  IconMessageQuestion,
  IconMessages,
  IconNote,
  IconStar,
  IconTrash,
  IconWallet,
} from '@tabler/icons-react';

interface AppType {
  label?: string;
  path?: string;
  icon?: JSX.Element;
  color?: string;
  sidebar: {
    label?: string;
    path?: string;
    icon?: JSX.Element;
    color?: string;
  }[];
}

export const APPS: AppType[] = [
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
    sidebar: [
      { label: 'All', path: '/todos', icon: <IconCheckbox /> },
      { label: 'Today', path: '/todos/today', icon: <IconCalendar /> },
      { label: 'Scheduled', path: '/todos/scheduled', icon: <IconCalendarEvent /> },
      { label: 'Important', path: '/todos/important', icon: <IconStar /> },
    ],
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
