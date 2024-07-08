import { Prompt } from '@/components/Robot/Prompt.types';
import { createSlice } from '@reduxjs/toolkit';

export interface RobotState {
  response: Prompt | null;
  prompts: Prompt[];
}

const initialState: RobotState = {
  response: null,
  prompts: [],
};

export const robotSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setResponse: (state, action) => {
      state.response = action.payload;
    },
    setPrompts: (state, action) => {
      state.prompts = action.payload;
    },
  },
});

export const { setResponse, setPrompts } = robotSlice.actions;

export default robotSlice.reducer;
