import { createSlice } from '@reduxjs/toolkit';

export interface LayoutState {
  mobileOpened: boolean;
  desktopOpened: boolean;
  appsOpened: boolean;
  userOpened: boolean;
}

const initialState: LayoutState = {
  mobileOpened: false,
  desktopOpened: true,
  appsOpened: false,
  userOpened: false,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleMobile: (state) => {
      state.mobileOpened = !state.mobileOpened;
    },
    closeMobile: (state) => {
      state.mobileOpened = false;
    },
    toggleDesktop: (state) => {
      state.desktopOpened = !state.desktopOpened;
    },
    setAppsOpened: (state, action) => {
      state.appsOpened = action.payload;
    },
    setUserOpened: (state, action) => {
      state.userOpened = action.payload;
    },
  },
});

export const { toggleMobile, closeMobile, toggleDesktop, setAppsOpened, setUserOpened } =
  layoutSlice.actions;

export default layoutSlice.reducer;
