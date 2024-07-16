import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { UserDataTypes } from '@/app/api/auth/[...nextauth]/next-auth.interfaces';
import startDb from '@/lib/db';
import Post from '@/models/Post';

export async function GET() {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const posts = await Post.find({ likes: session.user._id })
      .populate({ path: 'user', select: 'name username image' })
      .sort('-createdAt');
    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const isLiked = await Post.findById(req.nextUrl.searchParams.get('_id')).select('likes');
    if (isLiked?.likes?.includes(session?.user?._id)) {
      const post = await Post.findByIdAndUpdate(
        req.nextUrl.searchParams.get('_id'),
        { $pull: { likes: session?.user?._id } },
        { new: true }
      );
      return NextResponse.json(post, { status: 200 });
    }
    const post = await Post.findByIdAndUpdate(
      req.nextUrl.searchParams.get('_id'),
      { $addToSet: { likes: session?.user._id } },
      { new: true }
    );
    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
