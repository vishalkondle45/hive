import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Forum from '@/models/Forum';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../../auth/[...nextauth]/next-auth.interfaces';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    const body = await req.json();
    await startDb();
    const forum = await Forum.create({ ...body, user: session?.user._id });
    return NextResponse.json(forum, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
