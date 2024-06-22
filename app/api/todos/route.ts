import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import startDb from '@/lib/db';
import Todo from '@/models/Todo';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';

export async function GET() {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await startDb();
    const todoList = await Todo.find({ user: session?.user._id })
      .populate({
        path: 'list',
        select: 'title color -_id',
      })
      .sort('-updatedAt');
    return NextResponse.json(todoList, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    await startDb();
    if (body.list) {
      body.list = new mongoose.Types.ObjectId(String(body.list));
    } else {
      body.list = null;
    }
    const todoList = await Todo.create({ ...body, user: session?.user._id });
    return NextResponse.json(todoList, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
