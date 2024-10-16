import mongoose from 'mongoose';
import { parseBuffer } from 'music-metadata';
import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import startDb from '@/utils/db';
import Song from '@/models/Song';
import Album from '@/models/Album';
import { uploadToS3 } from '@/utils/functions';

export async function POST(req: NextRequest) {
  try {
    const { songs, album } = await req.json();
    await startDb();

    if (!songs?.length) {
      return NextResponse.json({ error: 'MP3 URL is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(album)) {
      return NextResponse.json({ error: 'Album ID is invalid' }, { status: 400 });
    }

    for (const url of songs) {
      const response = await fetch(url);
      if (!response.ok) {
        return NextResponse.json({ error: 'MP3 URL is invalid' }, { status: 400 });
      }

      const buffer = await response.arrayBuffer();
      const metadata = await parseBuffer(Buffer.from(buffer), 'audio/mpeg');
      const title = metadata.common.title?.split('::')[0].trim();
      const link = `music/tracks/${title}.mp3`;
      await uploadToS3(buffer, link, 'audio/mpeg');
      const song = await Song.create({
        album: album || 'Unknown Album',
        artist: metadata.common.artist?.split(',') || ['Unknown Artist'],
        duration: metadata.format.duration || 'Unknown Duration',
        genre: metadata.common.genre || ['Unknown Genre'],
        actors: metadata.common.albumartist?.split(',') || ['Unknown Actors'],
        title,
        link,
      });

      await Album.findOneAndUpdate(
        { _id: album },
        { $addToSet: { tracks: { $each: [song._id] } } }
      );
    }

    return NextResponse.json({ message: 'Songs created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error while creating song document' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const album_ = searchParams.get('album');
    await startDb();
    const songs = await Song.find({ album: album_ });
    const album = await Album.findById(album_);
    return NextResponse.json({ songs, album }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error while creating album document' }, { status: 500 });
  }
}
