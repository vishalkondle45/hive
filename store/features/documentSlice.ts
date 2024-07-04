import { createSlice } from '@reduxjs/toolkit';
import { DocumentType } from '@/models/Document';

interface DocumentObject {
  _id: string;
  title: string;
  content: string;
  isImportant: boolean;
  isTrashed: boolean;
}
export interface DocumentState {
  rename: {
    _id: string;
    title: string;
  };
  docs: DocumentType[];
  syncing: boolean;
  data: DocumentObject;
  opened: boolean;
  image: File | null;
}

const initialState: DocumentState = {
  rename: {
    _id: '',
    title: '',
  },
  docs: [],
  syncing: false,
  data: {
    _id: '',
    title: '',
    content: '',
    isImportant: false,
    isTrashed: false,
  },
  opened: false,
  image: null,
};

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    resetRename: (state) => {
      state.rename = { _id: '', title: '' };
    },
    setRename: (state, action) => {
      state.rename = action.payload;
    },
    setDocs: (state, action) => {
      state.docs = action.payload;
    },
    setSyncing: (state, action) => {
      state.syncing = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    setOpened: (state, action) => {
      state.opened = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
  },
});

export const { resetRename, setRename, setDocs, setSyncing, setData, setOpened, setImage } =
  documentSlice.actions;

export default documentSlice.reducer;
