import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import Prompt from '@/models/Prompt';
import { UserDataTypes } from '../auth/[...nextauth]/next-auth.interfaces';
import { geminiModelConfig } from '@/lib/constants';
import startDb from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

export const POST = async (req: Request): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user?._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    const model = genAI.getGenerativeModel(geminiModelConfig);
    const body = await req.json();
    const { prompt } = body;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    if (!prompt || !response) {
      return NextResponse.json({ error: 'Prompt or response is empty' }, { status: 404 });
    }
    const newPrompt = await Prompt.create({ user, prompt, response });
    return NextResponse.json(newPrompt, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
};

export const GET = async (): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user?._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    const prompts = await Prompt.find({ user }).sort('-createdAt');
    return NextResponse.json(prompts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
};

export const DELETE = async (): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user?._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    await Prompt.deleteMany({ user });
    return NextResponse.json(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
};
