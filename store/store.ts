import { configureStore } from '@reduxjs/toolkit';
import { loaderSlice } from './features/loaderSlice';
import { dataSlice } from './features/dataSlice';
import { documentSlice } from './features/documentSlice';
import { todoSlice } from './features/todoSlice';
import { spotlightSlice } from './features/spotlightSlice';
import { layoutSlice } from './features/layoutSlice';
import { driveSlice } from './features/driveSlice';

export const store = configureStore({
  reducer: {
    loader: loaderSlice.reducer,
    data: dataSlice.reducer,
    document: documentSlice.reducer,
    todo: todoSlice.reducer,
    spotlight: spotlightSlice.reducer,
    layout: layoutSlice.reducer,
    drive: driveSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
