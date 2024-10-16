import { NextRequest, NextResponse } from 'next/server';
import Album from '@/models/Album';
import startDb from '@/utils/db';
import { fetchImageBuffer, uploadToS3 } from '@/utils/functions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, composer, year, poster } = body;
    const buffer = await fetchImageBuffer(poster);
    const name = `music/posters/${title}.${poster.split('.').pop()}`;
    const result = await uploadToS3(buffer, name);
    if (!result) {
      return NextResponse.json({ error: 'Error uploading image to S3' }, { status: 500 });
    }
    await startDb();
    const album = await Album.create({
      title,
      composer,
      year,
      poster: `https://vishal-nextjs.s3.eu-north-1.amazonaws.com/${name}`,
    });
    return NextResponse.json({ album, message: 'Album created successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error while creating album document' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await startDb();
    const albums = await Album.find({});
    return NextResponse.json({ albums }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error while creating album document' }, { status: 500 });
  }
}
