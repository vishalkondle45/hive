import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { UserDataTypes } from '@/app/api/auth/[...nextauth]/next-auth.interfaces';
import Layout from '@/components/Layout/Layout';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
export default async function RootLayout({ children }: Props) {
  const session: UserDataTypes | null = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login');
  return (
    <>
      <Layout>{children}</Layout>
    </>
  );
}
