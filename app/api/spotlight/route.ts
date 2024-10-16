import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import startDb from '@/lib/db';
import Note from '@/models/Note';
import Todo from '@/models/Todo';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';
import Document from '@/models/Document';
import Album from '@/models/Album';
import Song from '@/models/Song';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json([], { status: 200 });
    }
    const user = session?.user._id;
    await startDb();
    let spotlight: any[] = [];
    const notes = await Note.find({ user });
    spotlight = spotlight.concat(
      notes.map((i) => ({
        id: `/notes${i?.isTrashed ? '/trashed' : i?.isArchived ? '/archive' : ''}#${i?._id}`,
        label: i?.title || 'Notes',
        description: `${i?.note} Notes`,
        type: 'notes',
      }))
    );
    const todos = await Todo.find({ user }).populate({ path: 'list', select: '_id title' });
    spotlight = spotlight.concat(
      todos.map((i) => ({
        id: `/todos${i?.list?._id ? `/${i?.list?._id}` : ''}#${i?._id}`,
        label: i?.todo || 'Todos',
        description: `${i?.list?.title || 'Todos'}`,
        type: 'todos',
      }))
    );
    const documents = await Document.find({ user });
    spotlight = spotlight.concat(
      documents.map((i) => ({
        id: `/documents/${i?._id}`,
        label: i?.title,
        description: `${i?.content?.replace(/<[^>]+>/g, ' ').slice(0, 100)} Document`,
        type: 'documents',
      }))
    );
    const albums = await Album.find({});
    spotlight = spotlight.concat(
      albums.map((i) => ({
        id: `/music/album/${i?._id}`,
        label: i?.title,
        description: 'Album',
        type: 'album',
      }))
    );
    const songs = await Song.find({}).populate('album', 'title');
    spotlight = spotlight.concat(
      songs.map((i, index) => ({
        id: `/music/album/${i?.album._id}#${index}`,
        label: i?.title,
        description: (i?.album as any)?.title,
        type: 'song',
      }))
    );
    return NextResponse.json(
      spotlight.sort(() => Math.random() - 0.5),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
