import { createSlice } from '@reduxjs/toolkit';
import { AlbumDocument, SongDocument } from '@/types/models';

type initialStateType = {
  albums: AlbumDocument[];
  isPlaying: boolean;
  currentTime: number;
  album: AlbumDocument;
  songs: SongDocument[];
  selected: SongDocument;
  isRepeat: boolean;
};

const initialState: initialStateType = {
  albums: [],
  isPlaying: false,
  currentTime: 0,
  album: {} as AlbumDocument,
  songs: [],
  selected: {} as SongDocument,
  isRepeat: false,
};

const musicSlice = createSlice({
  name: 'musicSlice',
  initialState,
  reducers: {
    setAlbums: (state, action) => {
      state.albums = action.payload;
    },
    setAlbum: (state, action) => {
      state.album = action.payload;
    },
    setSongs: (state, action) => {
      state.songs = action.payload;
    },
    toggleRepeat: (state, action) => {
      state.isRepeat = action.payload;
    },
    setSelectedSong: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setAlbums, setAlbum, setSongs, toggleRepeat, setSelectedSong } = musicSlice.actions;

export default musicSlice.reducer;
