import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import startDb from '@/lib/db';
import File from '@/models/File';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../../auth/[...nextauth]/next-auth.interfaces';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const file = req.nextUrl.searchParams.get('file');

    const basePath = {
      _id: '',
      name: 'Drive',
      parent: '',
    };

    if (!file) {
      return NextResponse.json([basePath], { status: 200 });
    }

    if (!Types.ObjectId.isValid(file)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const currentFile = await File.findById(file).select('name parent');

    if (!currentFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    let parent: Types.ObjectId | null = currentFile?.parent;
    let path = [currentFile];

    while (parent !== null) {
      const parentFile: any = await File.findById(parent).select('name parent');
      parent = parentFile?.parent;
      path = [parentFile, ...path];
    }

    return NextResponse.json([basePath, ...path], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
