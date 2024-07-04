import { createSlice } from '@reduxjs/toolkit';

export interface LoaderState {
  loading: boolean;
}

const initialState: LoaderState = {
  loading: false,
};

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    start: (state) => {
      state.loading = true;
    },
    stop: (state) => {
      state.loading = false;
    },
    toggle: (state) => {
      state.loading = !state.loading;
    },
  },
});

export const { start, stop, toggle } = loaderSlice.actions;

export default loaderSlice.reducer;
