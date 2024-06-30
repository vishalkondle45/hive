import mongoose, { Model, model, models, Schema, Types } from 'mongoose';

export interface FileDocument extends Document {
  _id?: Types.ObjectId;
  user: mongoose.Types.ObjectId;
  name: string;
  size: number;
  link?: string;
  parent: mongoose.Types.ObjectId;
}

const fileSchema = new Schema<FileDocument, {}>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'File',
      default: null,
    },
    name: {
      type: String,
      collation: { locale: 'en', strength: 2 },
      index: true,
    },
    size: {
      type: Number,
      default: 0,
      required: false,
    },
    link: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const File = models.File || model('File', fileSchema);

export default File as Model<FileDocument, {}>;
