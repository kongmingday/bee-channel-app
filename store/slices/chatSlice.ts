import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RefObject } from 'react';
import { TextInput } from 'react-native';

// Define a type for the slice state
export interface ChatState {
  parentId: string;
  userToId: string;
  deriveId: string;
  commentId: string;
  mainInputRef: RefObject<TextInput> | null;
  secondaryInputRef: RefObject<TextInput> | null;
}

// Define the initial state using that type
const initialState: ChatState = {
  parentId: '',
  userToId: '',
  deriveId: '',
  commentId: '',
  mainInputRef: null,
  secondaryInputRef: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    changeParentId: (state, params) => {
      state.parentId = params.payload;
    },
    changeUserToId: (state, params) => {
      state.userToId = params.payload;
    },
    changeDeriveId: (state, params) => {
      state.deriveId = params.payload;
    },
    changeMainInputRef: (state, params) => {
      state.mainInputRef = params.payload;
    },
    changeSecondaryInputRef: (state, params) => {
      state.secondaryInputRef = params.payload;
    },
  },
});

export const {
  changeParentId,
  changeUserToId,
  changeDeriveId,
  changeMainInputRef,
  changeSecondaryInputRef,
} = chatSlice.actions;

export default chatSlice.reducer;
