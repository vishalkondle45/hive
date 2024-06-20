import { NextResponse } from 'next/server';
import startDb from '@/lib/db';
import User from '@/models/User';
import { sendMail, verificationMessage } from '@/lib/functions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await startDb();

    let user = await User.findOne({ email: body.email });
    if (user) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    user = await User.create(body);

    await sendMail(user?.email, verificationMessage(user.name, String(user._id)));

    return NextResponse.json(user.email, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
