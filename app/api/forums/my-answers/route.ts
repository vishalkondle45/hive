import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Forum from '@/models/Forum';
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

    const forums = await Forum.find({
      question: { $exists: false },
      description: { $exists: true },
      user: session?.user._id,
    });

    const forumsIds = forums.map((forum) => forum._id);

    const answers = await Forum.find({ answers: { $in: forumsIds } }).populate({
      path: 'user',
      select: 'name',
    });

    return NextResponse.json(answers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
