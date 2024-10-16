import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import {
  IconArchive,
  IconBookmark,
  IconCalendar,
  IconCalendarDown,
  IconCalendarUp,
  IconCheckbox,
  IconClipboardText,
  IconCloud,
  IconCode,
  IconDisc,
  IconMessageQuestion,
  IconMessageReply,
  IconMessages,
  IconMusic,
  IconNote,
  IconNumber0Small,
  IconNumber10Small,
  IconNumber11Small,
  IconNumber12Small,
  IconNumber13Small,
  IconNumber14Small,
  IconNumber15Small,
  IconNumber16Small,
  IconNumber17Small,
  IconNumber18Small,
  IconNumber19Small,
  IconNumber1Small,
  IconNumber20Small,
  IconNumber21Small,
  IconNumber22Small,
  IconNumber23Small,
  IconNumber24Small,
  IconNumber2Small,
  IconNumber3Small,
  IconNumber4Small,
  IconNumber5Small,
  IconNumber6Small,
  IconNumber7Small,
  IconNumber8Small,
  IconNumber9Small,
  IconPlus,
  IconQuestionMark,
  IconRobot,
  IconStar,
  IconTags,
  IconTrash,
  IconWallet,
} from '@tabler/icons-react';

interface AppType {
  label?: string;
  path?: string;
  icon?: JSX.Element;
  color?: string;
  listIcon?: JSX.Element;
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
  {
    label: 'Robot',
    path: '/robot',
    icon: <IconRobot />,
    color: 'grape',
    sidebar: [{ label: 'Robot', path: '/robot', icon: <IconRobot /> }],
  },
  {
    label: 'Calendar',
    path: '/calendar',
    icon: <IconCalendar />,
    color: 'green',
    sidebar: [{ label: 'Calendar', path: '/calendar', icon: <IconCalendar /> }],
  },
  {
    label: 'Forum',
    path: '/forum',
    icon: <IconMessageQuestion />,
    color: 'indigo',
    sidebar: [
      { label: 'Home', path: '/forum', icon: <IconMessageQuestion /> },
      { label: 'Tags', path: '/forum/tags', icon: <IconTags /> },
      { label: 'Saved', path: '/forum/saved', icon: <IconBookmark /> },
      { label: 'You Asked', path: '/forum/my-questions', icon: <IconQuestionMark /> },
      { label: 'You Answered', path: '/forum/my-answers', icon: <IconMessageReply /> },
    ],
  },
  { label: 'Chat', path: '/chat', icon: <IconMessages />, color: 'pink', sidebar: [] },
  { label: 'Wallet', path: '/wallet', icon: <IconWallet />, color: 'red', sidebar: [] },
  { label: 'Dev Tools', path: '/dev', icon: <IconCode />, color: 'lime', sidebar: [] },
  {
    label: 'Music',
    path: '/music',
    icon: <IconMusic />,
    listIcon: <IconDisc />,
    color: 'dark',
    sidebar: [],
  },
];

export const COLORS = [
  'blue',
  'red',
  'indigo',
  'teal',
  'violet',
  'pink',
  'cyan',
  'grape',
  'lime',
  'orange',
  'yellow',
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

export const geminiModelConfig = {
  model: 'gemini-pro',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
};

export const hoursIcons = [
  <IconNumber0Small />,
  <IconNumber1Small />,
  <IconNumber2Small />,
  <IconNumber3Small />,
  <IconNumber4Small />,
  <IconNumber5Small />,
  <IconNumber6Small />,
  <IconNumber7Small />,
  <IconNumber8Small />,
  <IconNumber9Small />,
  <IconNumber10Small />,
  <IconNumber11Small />,
  <IconNumber12Small />,
  <IconNumber13Small />,
  <IconNumber14Small />,
  <IconNumber15Small />,
  <IconNumber16Small />,
  <IconNumber17Small />,
  <IconNumber18Small />,
  <IconNumber19Small />,
  <IconNumber20Small />,
  <IconNumber21Small />,
  <IconNumber22Small />,
  <IconNumber23Small />,
  <IconNumber24Small />,
];

export const FORUM_ANSWERS_SORT_OPTIONS = [
  {
    label: 'Highest score',
    value: 'highest',
  },
  {
    label: 'Newest',
    value: 'newest',
  },
  {
    label: 'Oldest',
    value: 'oldest',
  },
];
