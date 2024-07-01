import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import TodoList from '@/models/TodoList';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';

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
    const schema = req.nextUrl.searchParams.get('schema')?.toString();
    switch (schema) {
      case 'todos':
        list = await TodoList.find({ user: session?.user._id }).sort('-updatedAt');
        break;
      default:
        break;
    }
    return NextResponse.json(
      list?.map((i) => ({ path: `/${schema}/${i?._id}`, label: i?.title, color: i?.color })),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
