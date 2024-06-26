import dayjs from 'dayjs';
import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';
import startDb from '@/lib/db';

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

async function uploadImageToS3(file: Buffer, name: string) {
  try {
    const fileBuffer = file;
    const params = {
      Key: name,
      Body: fileBuffer,
      ACL: ObjectCannedACL.public_read,
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentType: 'image/*',
    };
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);
    return result;
  } catch (error) {
    return '';
  }
}

export async function POST(req: Request) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await startDb();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'Please select a file' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.parse(dayjs().format('MMMM DD YYYY HH:mm:ss'));
    const name = `${timestamp}.${file.name.split('.').pop()}`;
    const result = await uploadImageToS3(buffer, name);
    if (!result) {
      return NextResponse.json({ error: 'Error uploading image to S3' }, { status: 500 });
    }
    return NextResponse.json(`https://dream-by-vishal.s3.eu-north-1.amazonaws.com/${name}`, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
