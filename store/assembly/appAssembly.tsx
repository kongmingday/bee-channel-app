import { changeToastState } from '../slices/appSlice'
import { Dispatch } from '@reduxjs/toolkit'

export const handleShowToast = (dispatch: Dispatch, message: string) => {
  dispatch(changeToastState({ showState: true, showMessage: message }))
  setTimeout(() => {
    dispatch(changeToastState({ showState: false, showMessage: '' }))
  }, 2000)
}
