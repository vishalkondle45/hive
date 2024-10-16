import { IconAlbum, IconHome, IconUserCircle } from '@tabler/icons-react';

export const SIDEBAR_ITEMS = {
  MUSIC: [
    {
      label: 'Home',
      link: '/music',
      icon: IconHome,
    },
    {
      label: 'Albums',
      link: '/music/album',
      icon: IconAlbum,
    },
    {
      label: 'My Music',
      link: '/music/my-music',
      icon: IconUserCircle,
    },
  ],
  ROBOT: [
    {
      label: 'Home',
      link: '/robot',
      icon: IconHome,
    },
    {
      label: 'Chats',
      link: '/robot/chats',
      icon: IconAlbum,
    },
  ],
};
