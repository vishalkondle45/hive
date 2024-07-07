import mongoose, { Model, model, models, Schema, Types } from 'mongoose';

export interface EventDocument extends Document {
  _id?: Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  from: Date;
  to: Date;
  isAllDay: boolean;
  category?: mongoose.Types.ObjectId;
}

const eventSchema = new Schema<EventDocument, {}>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      collation: { locale: 'en', strength: 2 },
      index: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const Event = models.Event || model('Event', eventSchema);

export default Event as Model<EventDocument, {}>;
