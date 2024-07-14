import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
export default async function RootLayout({ children }: Props) {
  return <MantineProvider theme={{ primaryColor: 'grape' }}>{children}</MantineProvider>;
}
