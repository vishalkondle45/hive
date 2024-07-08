import { createSlice } from '@reduxjs/toolkit';

export interface SpotlightState {
  data: any[];
}

const initialState: SpotlightState = {
  data: [],
};

export const spotlightSlice = createSlice({
  name: 'spotlight',
  initialState,
  reducers: {
    setSpotlightItems: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setSpotlightItems } = spotlightSlice.actions;

export default spotlightSlice.reducer;
