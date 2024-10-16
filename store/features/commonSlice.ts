import { createSlice } from '@reduxjs/toolkit';

type initialStateType = {
  loading: boolean;
};

const initialState: initialStateType = {
  loading: false,
};

const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    toggleLoading: (state) => {
      state.loading = !state.loading;
    },
  },
});

export const { toggleLoading, setLoading } = commonSlice.actions;

export default commonSlice.reducer;
