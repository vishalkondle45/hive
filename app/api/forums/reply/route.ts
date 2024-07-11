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
    const { parent, ...remainingBody } = body;
    const reply = await Forum.create({ ...remainingBody, user: session?.user._id });
    await Forum.findByIdAndUpdate(parent, { $push: { answers: reply._id } });
    return NextResponse.json(reply, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
