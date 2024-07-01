import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import TodoList from '@/models/TodoList';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../../auth/[...nextauth]/next-auth.interfaces';
import Todo from '@/models/Todo';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    const body = await req.json();
    let todoList;
    if (body._id) {
      const { _id, ...remaining } = body;
      todoList = await TodoList.findByIdAndUpdate(_id, remaining);
    } else {
      delete body._id;
      todoList = await TodoList.create({ ...body, user: session?.user._id });
    }
    await startDb();
    return NextResponse.json(todoList, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    await TodoList.findByIdAndDelete(req.nextUrl.searchParams.get('_id'));
    await Todo.deleteMany({ list: req.nextUrl.searchParams.get('_id') });
    return NextResponse.json(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
