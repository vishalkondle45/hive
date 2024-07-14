import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import startDb from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../../auth/[...nextauth]/next-auth.interfaces';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const forums = await User.find({ _id: { $ne: session?.user._id } });
    return NextResponse.json(forums, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
