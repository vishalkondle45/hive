import mongoose, { Model, model, models, Schema, Types } from 'mongoose';

export interface TodoListDocument extends Document {
  _id?: Types.ObjectId;
  title: string;
  color: string;
  user: mongoose.Types.ObjectId;
}

const todoListSchema = new Schema<TodoListDocument, {}>(
  {
    title: {
      type: String,
      collation: { locale: 'en', strength: 2 },
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
  },
  { timestamps: true }
);

const TodoList = models.TodoList || model('TodoList', todoListSchema);

export default TodoList as Model<TodoListDocument, {}>;
