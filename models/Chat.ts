import { Document, Model, Schema, Types, model, models } from 'mongoose';

export interface History {
  role: string;
  parts: [{ text: string }];
}

export interface ChatDocument extends Document {
  user?: Types.ObjectId;
  history: History[];
}

const chatSchema = new Schema<ChatDocument>(
  {
    user: { type: Types.ObjectId, required: false },
    history: { type: [], default: [], required: true },
  },
  { timestamps: true }
);

const ChatModel = models.Chat || model('Chat', chatSchema);

export default ChatModel as Model<ChatDocument>;
