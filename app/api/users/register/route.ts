import { NextResponse } from 'next/server';
import startDb from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    body.role = undefined;
    await startDb();
    let user = await User.findOne({ email: body.email });
    if (user) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    user = await User.create(body);
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
