import mongoose, { Model, model, models, Schema, Types } from 'mongoose';
import { COLORS } from '@/lib/constants';

export interface EventDocument extends Document {
  _id?: Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  from: Date;
  to: Date;
  isAllDay: boolean;
  color: string;
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
    color: {
      type: String,
      enum: COLORS,
      default: 'blue',
      required: true,
    },
  },
  { timestamps: true }
);

const Event = models.Event || model('Event', eventSchema);

export default Event as Model<EventDocument, {}>;
