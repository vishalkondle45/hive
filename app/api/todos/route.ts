import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import startDb from '@/lib/db';
import Todo from '@/models/Todo';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';
import {
  getAllTodos,
  getImportantTodos,
  getListTodos,
  getUpcomingTodos,
  getTodaysTodos,
  getRecentTodos,
} from '@/lib/functions';
import '@/models/TodoList';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    const user = session?.user._id;
    await startDb();
    let todos: any[] = [];
    const type = req.nextUrl.searchParams.get('type')?.toString() ?? '';
    const list = req.nextUrl.searchParams.get('list')?.toString() ?? '';
    switch (type) {
      case 'today':
        todos = await getTodaysTodos(user);
        break;
      case 'important':
        todos = await getImportantTodos(user);
        break;
      case 'upcoming':
        todos = await getUpcomingTodos(user);
        break;
      case 'recent':
        todos = await getRecentTodos(user);
        break;
      case 'list':
        if (list) {
          todos = await getListTodos(user, list);
          break;
        }
        break;
      default:
        todos = await getAllTodos(user);
        break;
    }

    return NextResponse.json(todos, { status: 200 });
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
    await startDb();
    if (body.list) {
      body.list = new mongoose.Types.ObjectId(String(body.list));
    } else {
      body.list = null;
    }
    const todos = await Todo.create({ ...body, user: session?.user._id });
    return NextResponse.json(todos, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    const body = await req.json();
    await startDb();
    const todos = await Todo.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json(todos, { status: 200 });
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
    await Todo.findByIdAndDelete(req.nextUrl.searchParams.get('_id'));
    return NextResponse.json(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
