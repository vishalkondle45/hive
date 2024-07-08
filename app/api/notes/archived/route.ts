import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Note from '@/models/Note';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../../auth/[...nextauth]/next-auth.interfaces';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You are not authorized' }, { status: 401 });
    }
    await startDb();
    const note = await Note.find({
      user: session?.user._id,
      isArchived: true,
      isTrashed: false,
    }).sort('-updatedAt');
    return NextResponse.json(note, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
