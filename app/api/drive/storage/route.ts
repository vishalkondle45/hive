import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import startDb from '@/lib/db';
import File from '@/models/File';
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
    const files = await File.aggregate([
      { $match: { user: new Types.ObjectId(session?.user._id) } },
      { $group: { _id: null, totalSize: { $sum: '$size' } } },
      { $project: { _id: 0, totalSize: 1 } },
    ]);

    const largestTen = await File.find({
      user: session?.user._id,
      size: { $gt: 0 },
    }).sort('-size');

    return NextResponse.json(
      {
        used: files[0].totalSize,
        largestTen,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
