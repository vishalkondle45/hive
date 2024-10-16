import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import startDb from '@/utils/db';
import ChatModel from '@/models/Chat';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { geminiModelConfig } from '@/utils/constants';
import { UserDataTypes } from '@/types/next-auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

export const POST = async (req: Request): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    const model = genAI.getGenerativeModel(geminiModelConfig);
    const body = await req.json();
    const { prompt } = body;
    const request = model.startChat({ history: [] });
    const response = await request.sendMessage(prompt);
    const history = [
      { role: 'user', parts: [{ text: prompt }] },
      {
        role: 'model',
        parts: [{ text: response.response.text() }],
      },
    ];
    const newChat = await ChatModel.create({ user, history });
    return NextResponse.json(newChat, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const GET = async (req: NextRequest): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    const chat_id = req.nextUrl.searchParams.get('_id') as string;
    if (!chat_id) {
      const chats = await ChatModel.find({ user }).sort('-createdAt');
      return NextResponse.json(chats, { status: 200 });
    }
    const chat = await ChatModel.findOne({ user, _id: chat_id });
    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    const chat_id = req.nextUrl.searchParams.get('_id') as string;
    if (!chat_id) {
      await ChatModel.find({ user }).sort('-createdAt');
      return NextResponse.json(null, { status: 200 });
    }
    await ChatModel.deleteMany({ user, _id: chat_id });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest): Promise<any> => {
  try {
    const session: UserDataTypes | null = await getServerSession(authOptions);
    const user = session?.user._id;
    if (!session) {
      return NextResponse.json({ error: 'You are not authenticated!' }, { status: 401 });
    }
    await startDb();
    const model = genAI.getGenerativeModel(geminiModelConfig);
    const body = await req.json();
    const chat_id = req.nextUrl.searchParams.get('_id') as string;
    const Chat = await ChatModel.findOne({ _id: chat_id, user });
    if (!Chat) {
      return NextResponse.json({ error: 'Chat not found!' }, { status: 404 });
    }
    const request = model.startChat({ history: Chat?.history });
    const response = await request.sendMessage(body.prompt);
    const push = [
      { role: 'user', parts: [{ text: body.prompt }] },
      { role: 'model', parts: [{ text: response.response.text() }] },
    ];
    await ChatModel.findOneAndUpdate(
      { _id: chat_id, user },
      { $push: { history: { $each: push } } },
      { new: true }
    );
    return NextResponse.json(push[1], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
