// /app/api/music/get-song/route.js

import { NextRequest, NextResponse } from 'next/server';
import Song from '@/models/Song';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const link = searchParams.get('link');
  if (!link && !searchParams.get('id')) {
    return NextResponse.json({ error: 'MP3 URL is required' }, { status: 400 });
  }
  if (!link && searchParams.get('id')) {
    const song = await Song.findById(searchParams.get('id'));
    return NextResponse.json({ song, message: 'Song fetched successfully' });
  }
  const response = await fetch(String(link));
  const songData = await response.blob();
  return new Response(songData, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
