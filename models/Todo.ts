import mongoose, { Model, model, models, Schema, Types } from 'mongoose';
import { TodoListDocument } from './TodoList';

export interface TodoDocument extends Document {
  _id?: Types.ObjectId;
  todo: string;
  list: mongoose.Types.ObjectId;
  isImportant: boolean;
  isCompleted: boolean;
  date: Date | null;
  user: mongoose.Types.ObjectId;
  color: string;
}

const todoSchema = new Schema<TodoDocument, {}>(
  {
    todo: {
      type: String,
      index: true,
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TodoList',
      default: null,
    },
    date: {
      type: Date,
      default: null,
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    color: {
      type: String,
      enum: ['blue', 'red', 'green', 'indigo', 'teal', 'violet', 'pink', 'cyan', 'grape', 'lime'],
      default: '',
    },
  },
  { timestamps: true }
);

const Todo = models.Todo || model('Todo', todoSchema);

export default Todo as Model<TodoDocument, {}>;

export type TodoType = TodoDocument & { list: TodoListDocument };
