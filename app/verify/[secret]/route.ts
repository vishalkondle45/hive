import { NextResponse } from 'next/server';
import startDb from '@/lib/db';
import User from '@/models/User';
import { sendMail } from '@/lib/functions';

export async function GET(req: Request, { params }: { params: { secret: string } }) {
  try {
    await startDb();
    const user = await User.findById(params.secret);
    if (!user) return NextResponse.json({ error: 'Invalid verification link...' }, { status: 404 });
    user.isVerified = true;
    await user.save();
    await sendMail(
      user?.email,
      `Hello ${user.name}!\n\nYour account has been verified successfully. \n\nRegards, \nDream Team`
    );
    return NextResponse.json(
      'Your account has been verified, close this tab and proceed to login.',
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
