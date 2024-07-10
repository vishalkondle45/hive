import { createSlice } from '@reduxjs/toolkit';

export interface DataState {
  data: any;
}

const initialState: DataState = {
  data: [],
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    set: (state, action) => {
      state.data = action.payload;
    },
    reset: (state) => {
      state.data = [];
    },
  },
});

export const { set, reset } = dataSlice.actions;

export default dataSlice.reducer;
