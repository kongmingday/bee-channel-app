import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchDataPageReturn } from '../hook';

// Define a type for the slice state
export interface SearchState {
  keyword: string;
  tabIndex: number;
  fetchVideoFunction?: FetchDataPageReturn<any, any>;
  fetchUserFunction?: FetchDataPageReturn<any, any>;
}

// Define the initial state using that type
const initialState: SearchState = {
  keyword: '',
  tabIndex: 0,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    changeKeyword: (state, params) => {
      state.keyword = params.payload;
    },
    changeTabIndex: (state, params) => {
      state.tabIndex = params.payload;
    },
    changeVideoFetchFunction: (state, params) => {
      state.fetchVideoFunction = params.payload;
    },
    changeUserFetchFunction: (state, params) => {
      state.fetchUserFunction = params.payload;
    }
  },
});

export const {
  changeKeyword,
  changeTabIndex,
  changeVideoFetchFunction,
  changeUserFetchFunction,
} = searchSlice.actions;

export default searchSlice.reducer;
