import { RefObject } from 'react';
import { createSlice } from '@reduxjs/toolkit';
import { History } from '@/models/Chat';

type initialStateType = {
  chats: History[];
  prompt: string;
  loading: boolean;
  viewport: RefObject<HTMLDivElement> | null;
};

const initialState: initialStateType = {
  chats: [],
  prompt: '',
  loading: false,
  viewport: null,
};

const robotSlice = createSlice({
  name: 'robotSlice',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setViewport: (state, action) => {
      state.viewport = action.payload;
    },
  },
});

export const { setChats, setPrompt, setViewport, setLoading } = robotSlice.actions;

export default robotSlice.reducer;
