import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import startDb from '@/lib/db';
import { UserDataTypes } from '@/app/api/auth/[...nextauth]/next-auth.interfaces';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import File from '@/models/File';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const Bucket = process.env.AWS_BUCKET_NAME as string;

export const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(req: Request) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await startDb();
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];
    const parent = (formData.get('parent') as string) || null;
    const links: any[] = [];

    await Promise.all(
      files.map(async (file) => {
        const Body = (await file.arrayBuffer()) as Buffer;
        const Key = encodeURI(parent ? `${parent}/${file.name}` : file.name);
        await s3Client.send(new PutObjectCommand({ Bucket, Key, Body }));
        await File.create({
          user: session?.user._id,
          parent,
          name: file.name,
          size: file.size,
          link: Key,
        });
      })
    );

    return NextResponse.json(links, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await startDb();
    const Key = req.nextUrl.searchParams.get('Key') || '';
    const command = new GetObjectCommand({ Bucket, Key });
    const src = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return NextResponse.json(src, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await startDb();
    const _id = req.nextUrl.searchParams.get('_id') || '';
    const file = await File.findById(_id);
    return NextResponse.json(file, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
