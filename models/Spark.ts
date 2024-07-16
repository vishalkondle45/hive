import { Document, Model, Schema, Types, model, models } from 'mongoose';

interface SparkDocument extends Document {
  by?: Types.ObjectId;
  to?: Types.ObjectId;
  isAccepted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const sparkSchema = new Schema<SparkDocument>(
  {
    by: { type: Types.ObjectId, required: true, ref: 'User' },
    to: { type: Types.ObjectId, required: true, ref: 'User' },
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Spark = models.Spark || model('Spark', sparkSchema);

export default Spark as Model<SparkDocument>;
