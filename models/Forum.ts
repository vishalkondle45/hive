import { Document, Model, Schema, Types, model, models } from 'mongoose';
import { UserDocument } from './User';

export interface ForumDocument extends Document {
  question?: string;
  description?: string;
  parent?: Types.ObjectId;
  user?: Types.ObjectId | UserDocument;
  tags: string[];
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  views: Types.ObjectId[];
  saved: Types.ObjectId[];
  answers: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const forumSchema = new Schema<ForumDocument>(
  {
    question: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },
    parent: { type: Types.ObjectId, ref: 'Forum', default: null },
    user: { type: Types.ObjectId, required: true, ref: 'User' },
    tags: [{ type: String }],
    views: { type: [Types.ObjectId], default: [], ref: 'User' },
    upvotes: { type: [Types.ObjectId], default: [], ref: 'User' },
    downvotes: { type: [Types.ObjectId], default: [], ref: 'User' },
    saved: { type: [Types.ObjectId], default: [], ref: 'User' },
    answers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ForumModel = models.Forum || model('Forum', forumSchema);

export default ForumModel as Model<ForumDocument>;
