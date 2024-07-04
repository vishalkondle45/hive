import { createSlice } from '@reduxjs/toolkit';

export interface DriveState {
  driveData: {
    files: any[];
    path: any[];
  };
  openMoveDialog: boolean;
  __path: string;
  _path: any[];
  checked: string[];
  value: File[];
  folderName: string;
  preview: string;
}

const initialState: DriveState = {
  driveData: {
    files: [],
    path: [],
  },
  openMoveDialog: false,
  __path: '',
  _path: [],
  checked: [],
  value: [],
  folderName: 'Untitled folder',
  preview: '',
};

export const driveSlice = createSlice({
  name: 'drive',
  initialState,
  reducers: {
    setDriveData: (state, action) => {
      state.driveData = action.payload;
    },
    setOpenMoveDialog: (state, action) => {
      state.openMoveDialog = action.payload;
    },
    __setPath: (state, action) => {
      state.__path = action.payload;
    },
    _setPath: (state, action) => {
      state._path = action.payload;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setFolderName: (state, action) => {
      state.folderName = action.payload;
    },
    setPreview: (state, action) => {
      state.preview = action.payload;
    },
  },
});

export const {
  setDriveData,
  setOpenMoveDialog,
  __setPath,
  _setPath,
  setChecked,
  setFolderName,
  setValue,
  setPreview,
} = driveSlice.actions;

export default driveSlice.reducer;
