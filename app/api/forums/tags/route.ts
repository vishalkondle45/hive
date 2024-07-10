import dayjs from 'dayjs';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Forum from '@/models/Forum';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../../auth/[...nextauth]/next-auth.interfaces';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const today = dayjs().startOf('day');
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    const sort = req.nextUrl.searchParams.get('sort')?.toString() ?? 'name';
    await startDb();
    const tags = await Forum.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          total: { $sum: 1 },
          today: { $sum: { $cond: [{ $gte: ['$createdAt', today.toDate()] }, 1, 0] } },
        },
      },
      { $sort: sort === 'name' ? { _id: 1 } : sort === 'new' ? { createdAt: -1 } : { total: -1 } },
    ]);
    return NextResponse.json(tags, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
