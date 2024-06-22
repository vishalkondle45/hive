import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default async function RootLayout({ children }: Props) {
  return children;
}
