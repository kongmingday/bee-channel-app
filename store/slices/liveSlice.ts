import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type liveState = {
	roomId: string;
	userId: string;
	profile: string;
	username: string;
	webSocket?: WebSocket;
};

const initialState: liveState = {
	roomId: '',
	userId: '',
	profile: '',
	username: '',
};

const liveSlice = createSlice({
	name: 'live',
	initialState,
	reducers: {
		setUserId: (state, action: PayloadAction<string>) => {
			state.userId = action.payload;
		},
		setRoomId: (state, action: PayloadAction<string>) => {
			state.roomId = action.payload;
		},
		setUsername: (state, action: PayloadAction<string>) => {
			state.username = action.payload;
		},
		setProfile: (state, action: PayloadAction<string>) => {
			state.profile = action.payload;
		},
		setWebSocket: (state, action: PayloadAction<WebSocket>) => {
			state.webSocket = action.payload;
		},
	},
});

export const { setUserId, setRoomId, setWebSocket, setUsername, setProfile } =
	liveSlice.actions;

export default liveSlice.reducer;
