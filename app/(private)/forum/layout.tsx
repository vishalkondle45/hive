import { Container, MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
export default async function RootLayout({ children }: Props) {
  return (
    <MantineProvider theme={{ primaryColor: 'indigo' }}>
      <Container px={0}>{children}</Container>
    </MantineProvider>
  );
}
