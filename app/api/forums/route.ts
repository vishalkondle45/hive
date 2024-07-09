import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Forum from '@/models/Forum';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const _id = req.nextUrl.searchParams.get('_id')?.toString() ?? '';
    const tags = req.nextUrl.searchParams.get('tag')?.toString() ?? '';

    if (_id) {
      const forum = await Forum.find({ _id }).populate('user');
      return NextResponse.json(forum, { status: 200 });
    }

    if (tags) {
      const forums = await Forum.find({ tags }).populate('user').sort('-updatedAt');
      return NextResponse.json(forums, { status: 200 });
    }

    const forums = await Forum.find({}).populate('user').sort('-updatedAt');
    return NextResponse.json(forums, { status: 200 });
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
    const forum = await Forum.create({ ...body, user: session?.user._id });
    return NextResponse.json(forum, { status: 200 });
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
    const forum = await Forum.findByIdAndUpdate(body._id, body);
    return NextResponse.json(forum, { status: 200 });
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
    await Forum.findByIdAndDelete(req.nextUrl.searchParams.get('_id'));
    return NextResponse.json(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
