import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Spark from '@/models/Spark';
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
    const forums = await Spark.find({
      $or: [{ by: session?.user._id }, { to: session?.user._id }],
    });
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
    const isAlreadyExist = await Spark.findOne({ to: body.to, by: session?.user._id });
    if (isAlreadyExist) {
      const forum = await Spark.findByIdAndDelete(isAlreadyExist._id);
      return NextResponse.json(forum, { status: 200 });
    }
    const forum = await Spark.create({ ...body, by: session?.user._id });
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
    await Spark.findByIdAndDelete(req.nextUrl.searchParams.get('_id'));
    return NextResponse.json(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
