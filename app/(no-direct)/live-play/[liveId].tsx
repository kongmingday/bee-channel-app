import { TransparentView, PressableIcon } from '@/components/Themed';
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';
import VideoPlayer from 'expo-video-player';
import { ResizeMode } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { setStatusBarHidden } from 'expo-status-bar';
import { Video } from 'expo-av';
import { Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SimpleMedia } from '@/.expo/types/media';
import { useDispatch } from 'react-redux';
import { getLiveUserInfo } from '@/api/live';
import { LiveChatContainer, LivePageDetail } from '@/components/LivePage';

const LIVE_HOST = process.env.EXPO_PUBLIC_LIVE_ROOM_HOST;

export default function LivePlayScreen() {
	const [inFullscreen, setInFullscreen] = useState(false);
	const videoRef = useRef<Video>(new Video({}));
	const [videoInfo, setVideoInfo] = useState<SimpleMedia>();

	const dispatch = useDispatch();

	useEffect(() => {
		const fetchVideoInfo = async () => {
			const { result } = await getLiveUserInfo('006774');
			setVideoInfo(result);
		};
		fetchVideoInfo();
	}, []);

	return (
		<LinearGradient
			colors={['#e9defa', '#ace0f9']}
			className='flex-1 '>
			<VideoPlayer
				videoProps={{
					shouldPlay: false,
					resizeMode: ResizeMode.CONTAIN,
					source: {
						uri: `${LIVE_HOST}/00674.flv`,
					},
					ref: videoRef,
				}}
				header={
					<TransparentView
						className='w-full'
						style={{
							backgroundColor: 'rgba(0,0,0,0.5)',
						}}>
						<PressableIcon
							name='chevron-left'
							size={40}
							color={`#FFFFFF`}
							onPress={event => {
								router.back();
							}}
						/>
					</TransparentView>
				}
				fullscreen={{
					inFullscreen: inFullscreen,
					enterFullscreen: async () => {
						setStatusBarHidden(true, 'fade');
						setInFullscreen(!inFullscreen);
						await ScreenOrientation.lockAsync(
							ScreenOrientation.OrientationLock.LANDSCAPE_LEFT,
						);
						videoRef.current.setStatusAsync({
							shouldPlay: true,
						});
					},
					exitFullscreen: async () => {
						setStatusBarHidden(false, 'fade');
						setInFullscreen(!inFullscreen);
						await ScreenOrientation.lockAsync(
							ScreenOrientation.OrientationLock.PORTRAIT_UP,
						);
					},
				}}
				style={{
					controlsBackgroundColor: 'transparent',
					videoBackgroundColor: 'black',
					height: inFullscreen ? Dimensions.get('window').width : 255,
					width: inFullscreen
						? Dimensions.get('window').height
						: Dimensions.get('window').width,
				}}
			/>
			<LivePageDetail
				videoInfo={videoInfo}
				setVideoInfo={setVideoInfo}
			/>
			<LiveChatContainer />
		</LinearGradient>
	);
}
