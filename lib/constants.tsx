import {
  IconArchive,
  IconCalendar,
  IconCalendarDown,
  IconCalendarUp,
  IconCheckbox,
  IconClipboardText,
  IconCloud,
  IconCode,
  IconLock,
  IconMessageQuestion,
  IconMessages,
  IconNote,
  IconPlus,
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
    color: 'teal',
    icon: <IconCheckbox />,
    sidebar: [
      { label: 'All', path: '/todos', icon: <IconCheckbox /> },
      { label: 'Today', path: '/todos/today', icon: <IconCalendar /> },
      { label: 'Important', path: '/todos/important', icon: <IconStar /> },
      { label: 'Recent', path: '/todos/recent', icon: <IconCalendarUp /> },
      { label: 'Upcoming', path: '/todos/upcoming', icon: <IconCalendarDown /> },
    ],
  },
  {
    label: 'Documents',
    path: '/documents',
    icon: <IconClipboardText />,
    color: 'violet',
    sidebar: [
      {
        label: 'New Document',
        path: '/documents/new',
        icon: <IconPlus />,
      },
      {
        label: 'Documents',
        path: '/documents',
        icon: <IconClipboardText />,
      },
      {
        label: 'Trash',
        path: '/documents/trash',
        icon: <IconTrash />,
      },
    ],
  },
  {
    label: 'Drive',
    path: '/drive',
    icon: <IconCloud />,
    color: 'cyan',
    sidebar: [{ label: 'My Drive', path: '/drive', icon: <IconCloud /> }],
  },
  { label: 'Calendar', path: '/calendar', icon: <IconCalendar />, color: 'green', sidebar: [] },
  { label: 'Forum', path: '/forum', icon: <IconMessageQuestion />, color: 'indigo', sidebar: [] },
  { label: 'Passwords', path: '/passwords', icon: <IconLock />, color: 'red', sidebar: [] },
  { label: 'Chat', path: '/chat', icon: <IconMessages />, color: 'pink', sidebar: [] },
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

export const STYLES = {
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 16,
    paddingInline: 0,
    fontWeight: 'bold',
  },
};

export const FONTS = [
  {
    label: 'Default',
    value: '',
  },
  {
    label: 'Comic Sans',
    value: 'Comic Sans MS, Comic Sans',
  },
  {
    label: 'Serif',
    value: 'serif',
  },
  {
    label: 'Monospace',
    value: 'monospace',
  },
  {
    label: 'Cursive',
    value: 'cursive',
  },
];

export const spotlightItems = [];
