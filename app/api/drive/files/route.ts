import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { CopyObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Types } from 'mongoose';
import startDb from '@/lib/db';
import File from '@/models/File';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../../auth/[...nextauth]/next-auth.interfaces';

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const parent = req.nextUrl.searchParams.get('parent') ?? null;

    if (parent && !Types.ObjectId.isValid(parent)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const files = await File.find({ user: session?.user._id, parent })
      .select('-createdAt -user -__v')
      .populate({ path: 'parent', select: 'parent' })
      // .populate({ path: 'user', select: 'name' })
      .sort('-updatedAt');
    return NextResponse.json(files, { status: 200 });
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
    const file = await File.create({ ...body, user: session?.user._id });
    return NextResponse.json(file, { status: 200 });
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
    let response: any[] = [];
    await Promise.all(
      body?.ids?.map(async (file: string) => {
        const fl = await File.findById(file);
        const Key = encodeURI(body?.parent ? `${body?.parent}/${fl?.name}` : fl?.name || '');
        if (fl?.link) {
          const input = {
            Bucket: 'dream-by-vishal',
            CopySource: `dream-by-vishal/${encodeURI(fl.link)}`,
            Key,
          };
          await s3Client.send(new CopyObjectCommand(input));
          await s3Client.send(new DeleteObjectCommand({ Bucket: 'dream-by-vishal', Key: fl.link }));
        }
        const input = { parent: body?.parent || null, link: Key };
        await fl?.updateOne(input);
        response = [...response, fl];
      })
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

const deleteAllChilds = async (fl: any) => {
  if (fl?.link) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'dream-by-vishal',
        Key: fl?.link,
      })
    );
    await fl?.deleteOne();
    return true;
  }
  const shouldDelete = await File.find({ parent: fl?._id });
  await fl?.deleteOne();
  await Promise.all(
    shouldDelete.map(async (item) => {
      await File.findByIdAndDelete(item._id);
      deleteAllChilds(item);
    })
  );
  return false;
};

const findAndDeleteChilds = async (file: any) => {
  const fl = await File.findById(file);
  return deleteAllChilds(fl);
};

export async function DELETE(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const ids = JSON.parse(req.nextUrl.searchParams.get('_id') || '');
    await Promise.all(
      ids.map((file: string) => {
        const some = new Promise((resolve) => {
          findAndDeleteChilds(file).then(resolve);
        });
        return some;
      })
    );
    return NextResponse.json(ids, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
