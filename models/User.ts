import bcrypt from 'bcryptjs';
import { Model, model, models, Schema, Types } from 'mongoose';

export interface UserDocument extends Document {
  _id?: Types.ObjectId;
  name: string;
  mobile?: string;
  email?: string;
  password: string;
  isAdmin: boolean;
}

interface Methods {
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      collation: { locale: 'en', strength: 2 },
      index: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  console.log(this.password);

  return next();
});

userSchema.methods.comparePassword = async function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

const User = models.User || model('User', userSchema);

export default User as Model<UserDocument, {}, Methods>;
