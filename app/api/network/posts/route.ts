import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/lib/db';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../../auth/[...nextauth]/next-auth.interfaces';
import Spark from '@/models/Spark';
import Post from '@/models/Post';
import { uploadImageToS3 } from '@/lib/functions';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET() {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const to = await Spark.find({ by: session.user?._id, isAccepted: true }).select('to');
    const posts = await Post.find({
      $or: [{ user: { $in: to.map((t) => t.to) } }, { user: session.user?._id }],
    }).populate({
      path: 'user',
      select: 'name username image',
    });
    return NextResponse.json(posts, { status: 200 });
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
    await startDb();
    const formdata = await req.formData();
    const caption = formdata.get('caption');
    const file = formdata.get('file') as File;
    if (!file) return NextResponse.json({ error: 'Please select a file' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const name = `${timestamp}.${file.name.split('.').pop()}`;
    const result = await uploadImageToS3(buffer, name);
    if (!result) {
      return NextResponse.json({ error: 'Error uploading image to S3' }, { status: 500 });
    }
    const post = await Post.create({
      user: session?.user._id,
      caption,
      url: `https://dream-by-vishal.s3.eu-north-1.amazonaws.com/${name}`,
    });
    return NextResponse.json(post, { status: 200 });
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
    const post = await Post.findByIdAndUpdate(req.nextUrl.searchParams.get('_id'), body, {
      new: true,
    });
    return NextResponse.json(post, { status: 200 });
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
    const post = await Post.findByIdAndDelete(req.nextUrl.searchParams.get('_id'));

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'dream-by-vishal',
        Key: post?.url.split('/').pop(),
      })
    );

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
