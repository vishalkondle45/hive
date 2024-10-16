import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import TodoList from '@/models/TodoList';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';
import Chat from '@/models/Chat';
import Album from '@/models/Album';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json([], { status: 200 });
    }
    await startDb();
    let list: any[] = [];
    const schema = req.nextUrl.searchParams.get('schema')?.toString() ?? '';
    switch (schema) {
      case 'todos':
        const todos = await TodoList.find({ user: session?.user._id }).sort('-updatedAt');
        list = [
          ...list,
          ...todos.map((i) => ({ path: `/todos/${i?._id}`, label: i?.title, color: i?.color })),
        ];
        break;
      case 'robot':
        const chat = await Chat.find({ user: session?.user._id }).sort('-updatedAt');
        list = [
          ...list,
          ...chat.map((i) => ({
            path: `/robot/chats/${i?._id}`,
            label: i?.history[0].parts[0].text,
          })),
        ];
        break;
      case 'music':
        const albums = await Album.find().sort('-updatedAt');
        list = [
          ...list,
          ...albums.map((i) => ({ path: `/music/album/${i?._id}`, label: i?.title })),
        ];
        break;
      default:
        break;
    }
    return NextResponse.json(list, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
