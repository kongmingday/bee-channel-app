import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface AppState {
  toastShowState: boolean
  toastMessage: string
}

// Define the initial state using that type
const initialState: AppState = {
  toastShowState: false,
  toastMessage: ''
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeToastState: (state, params) => {
      state.toastMessage = params.payload.showMessage
      state.toastShowState = params.payload.showState
    }
  }
})

export const { changeToastState: changeToastState } = appSlice.actions

export default appSlice.reducer
