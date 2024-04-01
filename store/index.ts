import { configureStore } from '@reduxjs/toolkit';
import AppReducer from './slices/appSlice';
import ChatReducer from './slices/chatSlice';
import SearchSlice from './slices/searchSlice';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    app: AppReducer,
    chat: ChatReducer,
    search: SearchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
