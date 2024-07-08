import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { UserDataTypes } from '@/app/api/auth/[...nextauth]/next-auth.interfaces';

interface Props {
  children: ReactNode;
}
export default async function RootLayout({ children }: Props) {
  const session: UserDataTypes | null = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login');

  if (session.user) {
    return children;
  }
}
