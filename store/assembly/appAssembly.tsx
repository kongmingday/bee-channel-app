import { useAppDispatch } from '../hook';
import { changeToastState } from '../slices/appSlice';
import { Dispatch } from '@reduxjs/toolkit';

export const handleShowToast = (dispatch: Dispatch, message: string) => {
	dispatch(changeToastState({ showState: true, showMessage: message }));
	setTimeout(() => {
		dispatch(changeToastState({ showState: false, showMessage: '' }));
	}, 2000);
};

export const HandleShowToast = (props: { message: string }) => {
	const { message } = props;
	const dispatch = useAppDispatch();
	dispatch(changeToastState({ showState: true, showMessage: message }));
	setTimeout(() => {
		dispatch(changeToastState({ showState: false, showMessage: '' }));
	}, 2000);
	return <></>;
};
