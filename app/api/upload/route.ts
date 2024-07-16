import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';
import startDb from '@/lib/db';
import { uploadImageToS3 } from '@/lib/functions';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await startDb();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'Please select a file' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const name = `${timestamp}.${file.name.split('.').pop()}`;
    const result = await uploadImageToS3(buffer, name);
    if (!result) {
      return NextResponse.json({ error: 'Error uploading image to S3' }, { status: 500 });
    }
    return NextResponse.json(`https://hive-by-vishal.s3.eu-north-1.amazonaws.com/${name}`, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
