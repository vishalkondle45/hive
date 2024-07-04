import { Document, Model, Schema, Types, model, models } from 'mongoose';

interface PromptDocument extends Document {
  prompt?: string;
  response: string;
  user?: Types.ObjectId;
}

const promptSchema = new Schema<PromptDocument>(
  {
    prompt: { type: String, required: false, trim: true },
    response: { type: String, required: true, trim: true },
    user: { type: Types.ObjectId, required: false },
  },
  { timestamps: true }
);

const Prompt = models.Prompt || model('Prompt', promptSchema);

export default Prompt as Model<PromptDocument>;
