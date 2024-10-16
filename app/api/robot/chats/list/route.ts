import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import startDb from '@/utils/db';
import ChatModel from '@/models/Chat';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '@/types/next-auth';

export const GET = async (): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    const chats = await ChatModel.aggregate([
      { $sort: { updatedAt: -1 } },
      {
        $project: { title: { $arrayElemAt: [{ $arrayElemAt: ['$history.parts.text', 0] }, 0] } },
      },
    ]);
    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const DELETE = async (): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user?._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    await ChatModel.deleteMany({ user });
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
