import { Types } from 'mongoose';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '@/app/api/auth/[...nextauth]/next-auth.interfaces';
import startDb from '@/lib/db';
import PromptModel from '@/models/Prompt';

export const GET = async (
  req: Request,
  { params }: { params: { prompt_id: Types.ObjectId } }
): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user?._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    const prompt = await PromptModel.findOne({ user, _id: params.prompt_id });
    return NextResponse.json(prompt, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
export const DELETE = async (
  req: Request,
  { params }: { params: { prompt_id: Types.ObjectId } }
): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user?._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    await PromptModel.findOneAndDelete({
      user,
      _id: params.prompt_id,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
