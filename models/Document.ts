import mongoose, { Model, model, models, Schema, Types } from 'mongoose';

export interface DocumentDocument extends Document {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
  isImportant: boolean;
  isTrashed: boolean;
}

const documentSchema = new Schema<DocumentDocument, {}>(
  {
    title: {
      type: String,
      collation: { locale: 'en', strength: 2 },
      index: true,
      default: 'Untitled Document',
    },
    content: {
      type: String,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Document = models.Document || model('Document', documentSchema);

export type DocumentType = DocumentDocument & { createdAt: string; updatedAt: string };

export default Document as Model<DocumentDocument, {}>;
