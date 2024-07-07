import dayjs from 'dayjs';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Event from '@/models/Event';
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
    const month = req.nextUrl.searchParams.get('month')?.toString() ?? '';
    await startDb();
    const event = await Event.find({
      user: session?.user._id,
      $or: [
        {
          from: {
            $gte: dayjs(month).startOf('month').toDate(),
            $lte: dayjs(month).endOf('month').toDate(),
          },
        },
        {
          to: {
            $gte: dayjs(month).startOf('month').toDate(),
            $lte: dayjs(month).endOf('month').toDate(),
          },
        },
      ],
    }).sort('-updatedAt');
    return NextResponse.json(event, { status: 200 });
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
    const event = await Event.create({ ...body, user: session?.user._id });
    return NextResponse.json(event, { status: 200 });
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
    const event = await Event.findByIdAndUpdate(body._id, {
      ...body,
      from: body.isAllDay ? dayjs(body.from).startOf('day').toDate() : dayjs(body.from).toDate(),
      to: body.isAllDay ? dayjs(body.to).endOf('day').toDate() : dayjs(body.to).toDate(),
    });
    return NextResponse.json(event, { status: 200 });
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
    await Event.findByIdAndDelete(req.nextUrl.searchParams.get('_id'));
    return NextResponse.json(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
