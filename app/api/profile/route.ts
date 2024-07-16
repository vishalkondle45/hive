import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';
import Spark from '@/models/Spark';
import Post from '@/models/Post';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const _user = req.nextUrl.searchParams.get('username');
    let user = null;
    if (_user) {
      user = await User.findOne({ username: _user }).select(
        'name username image bio city interests dob'
      );
      if (!user) {
        return NextResponse.json({ error: 'Username not found' }, { status: 404 });
      }
    } else {
      user = await User.findById(_user ?? session?.user._id).select(
        'name username image bio city interests dob'
      );
    }
    const by = await Spark.find({ by: user?._id })
      .populate({
        path: 'to',
        select: 'name username image',
      })
      .select('-createdAt -updatedAt -__v');
    const to = await Spark.find({ to: user?._id })
      .populate({
        path: 'by',
        select: 'name username image',
      })
      .select('-createdAt -updatedAt -__v');
    const posts = await Post.find({ user: user?._id }).populate({
      path: 'user',
      select: 'name username image',
    });
    const isSparked = await Spark.findOne({
      to: user?._id,
      by: session?.user._id,
      // isAccepted: true,
    });
    if (!isSparked && user?._id === session?.user._id) {
      return NextResponse.json(
        { user, by: by?.length, to: to?.length, posts: posts?.length, isSparked: !!isSparked },
        { status: 200 }
      );
    }
    return NextResponse.json({ user, by, to, posts, isSparked: !!isSparked }, { status: 200 });
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
    const isAlreadyExist = await User.findOne({
      username: body.username,
      _id: { $ne: session?.user._id },
    });
    if (isAlreadyExist && body.username) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    const user = await User.findByIdAndUpdate(session?.user._id, body, { new: true }).select(
      'username name dob image'
    );
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
