import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
export interface ChatState {
  parentId: string;
  userToId: string;
  deriveId: string;
  commentId: string;
}

// Define the initial state using that type
const initialState: ChatState = {
  parentId: '',
  userToId: '',
  deriveId: '',
  commentId: ''
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
  },
});

export const { changeParentId, changeUserToId, changeDeriveId } =
  chatSlice.actions;

export default chatSlice.reducer;
