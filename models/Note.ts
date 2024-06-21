import mongoose, { Model, model, models, Schema, Types } from 'mongoose';

export interface NoteDocument extends Document {
  _id?: Types.ObjectId;
  title: string;
  note: string;
  color: string;
  user: mongoose.Types.ObjectId;
  isPinned: boolean;
  isTrashed: boolean;
  isArchived: boolean;
}

const noteSchema = new Schema<NoteDocument, {}>(
  {
    title: {
      type: String,
      collation: { locale: 'en', strength: 2 },
      index: true,
    },
    note: {
      type: String,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    color: {
      type: String,
      enum: [
        'gray.0',
        'blue',
        'red',
        'green',
        'indigo',
        'teal',
        'violet',
        'pink',
        'cyan',
        'grape',
        'lime',
      ],
      default: 'gray.0',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Note = models.Note || model('Note', noteSchema);

export default Note as Model<NoteDocument, {}>;
