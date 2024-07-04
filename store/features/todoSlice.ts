import { createSlice } from '@reduxjs/toolkit';

export interface TodoState {
  list: {
    _id: string;
    color: string;
    title: string;
  };
  opened1: boolean;
  todoList: any[];
}

const initialState: TodoState = {
  list: {
    _id: '',
    color: '',
    title: '',
  },
  opened1: false,
  todoList: [],
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setOpened1: (state, action) => {
      state.opened1 = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    resetList: (state) => {
      state.list = {
        _id: '',
        color: '',
        title: '',
      };
    },
    setTodoList: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setOpened1, setList, resetList, setTodoList } = todoSlice.actions;

export default todoSlice.reducer;
