import { Document, Model, Schema, Types, model, models } from 'mongoose';

export interface PostDocument extends Document {
  _id?: Types.ObjectId;
  user?: Types.ObjectId;
  url: string;
  caption?: string;
  likes: Types.ObjectId[];
  saved: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema<PostDocument>(
  {
    user: { type: Types.ObjectId, required: true, ref: 'User' },
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    likes: { type: [Types.ObjectId], default: [], ref: 'User' },
    saved: { type: [Types.ObjectId], default: [], ref: 'User' },
  },
  { timestamps: true }
);

const Post = models.Post || model('Post', postSchema);

export default Post as Model<PostDocument>;
