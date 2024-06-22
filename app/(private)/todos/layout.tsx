import { Container } from '@mantine/core';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default async function RootLayout({ children }: Props) {
  return (
    <Container px={0} size="sm">
      {children}
    </Container>
  );
}
