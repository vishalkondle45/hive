import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '@/app/api/auth/[...nextauth]/next-auth.interfaces';
import startDb from '@/lib/db';
import Prompt from '@/models/Prompt';

export const GET = async (): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user?._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    const prompts = await Prompt.find({ user }).select('prompt').sort('-createdAt');
    return NextResponse.json(prompts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
