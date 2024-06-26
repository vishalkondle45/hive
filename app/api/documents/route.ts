import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Document from '@/models/Document';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';

export async function GET(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    const _id = req.nextUrl.searchParams.get('_id')?.toString() ?? '';
    const isTrashed = req.nextUrl.searchParams.get('isTrashed')?.toString() === 'true';
    await startDb();
    if (_id) {
      const document = await Document.findOne({ _id, user: session?.user._id, isTrashed });
      return NextResponse.json(document, { status: 200 });
    }
    const document = await Document.find({
      user: session?.user._id,
      isTrashed,
    }).sort('-updatedAt');
    return NextResponse.json(document, { status: 200 });
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
    const document = await Document.create({ ...body, user: session?.user._id });
    return NextResponse.json(document, { status: 200 });
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
    if (!body.title) {
      body.title = 'Untitled Document';
    }
    const document = await Document.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json(document, { status: 200 });
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
    await Document.findByIdAndDelete(req.nextUrl.searchParams.get('_id'));
    return NextResponse.json(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
