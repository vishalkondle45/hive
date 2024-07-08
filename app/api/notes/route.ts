import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Note from '@/models/Note';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const note = await Note.find({
      user: session?.user._id,
      isTrashed: false,
      isArchived: false,
    }).sort('-updatedAt');
    return NextResponse.json(note, { status: 200 });
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
    const note = await Note.create({ ...body, user: session?.user._id });
    return NextResponse.json(note, { status: 200 });
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
    const note = await Note.findByIdAndUpdate(body._id, body);
    return NextResponse.json(note, { status: 200 });
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
    await Note.findByIdAndDelete(req.nextUrl.searchParams.get('_id'));
    return NextResponse.json(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
