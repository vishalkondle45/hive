import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import TodoList from '@/models/TodoList';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../../auth/[...nextauth]/next-auth.interfaces';

export async function GET() {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await startDb();
    const todoList = await TodoList.find({ user: session?.user._id }).sort('-updatedAt');
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
    const todoList = await TodoList.create({ ...body, user: session?.user._id });
    return NextResponse.json(todoList, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
