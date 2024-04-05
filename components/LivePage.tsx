import { FlashList } from '@shopify/flash-list';
import { BaseBlurButton, FeatherIcon, Text, TransparentView } from './Themed';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AnimatePresence, MotiView } from 'moti';
import { useState, Dispatch, SetStateAction, useRef } from 'react';
import { Pressable, TextInput } from 'react-native';
import { Avatar } from '@rneui/themed';
import { SimpleMedia } from '@/.expo/types/media';
import { PATH_CONSTANTS } from '@/.expo/types/constant';
import { favoriteAction } from '@/api/media';
import { DeriveType, FavoriteType } from '@/.expo/types/enum';
import { subscribeAction } from '@/api/user';
import { favoriteDataPackaging } from '@/utils/common/calculateUtil';
import { useWebSocket } from './useWebSocket';
import { secondBgColor } from '@/constants/Colors';
import { LiveMessage } from '@/.expo/types/live';
import { BlurView } from 'expo-blur';
import { useAppSelector } from '@/store/hook';
import { useLocalSearchParams } from 'expo-router';

export const LivePageDetail = (props: {
	videoInfo?: SimpleMedia;
	setVideoInfo: Dispatch<SetStateAction<SimpleMedia | undefined>>;
}) => {
	const [isOpen, setOpenState] = useState(false);
	const { videoInfo, setVideoInfo } = props;

	const handleSubscribeChange = () => {
		videoInfo &&
			subscribeAction(videoInfo?.authorId).then(response => {
				if (response.result) {
					setVideoInfo({
						...videoInfo,
						author: {
							...videoInfo.author,
							hasConcern: !videoInfo.author.hasConcern,
						},
					});
				}
			});
	};

	return (
		<TransparentView
			className='px-6 pt-3 my-2'
			style={{
				rowGap: 10,
			}}>
			<TransparentView className='flex-row w-full justify-between items-center'>
				<TransparentView
					className='flex-row items-center'
					style={{
						columnGap: 10,
					}}>
					<Avatar
						source={{
							uri: `${PATH_CONSTANTS}${videoInfo?.author.profile}`,
						}}
						rounded
						size={42}
					/>
					<Text
						className='text-base'
						numberOfLines={1}
						style={{
							maxWidth: 200,
						}}>
						{`${videoInfo?.author.username}`}
					</Text>
				</TransparentView>
				<BaseBlurButton
					containerStyle={{
						width: 120,
					}}
					title={`${
						videoInfo?.author.hasConcern ? 'Unsubscribe' : 'Subscribe'
					}`}
					onPress={handleSubscribeChange}
				/>
			</TransparentView>
			<TransparentView className='px-2'>
				<TransparentView className='flex-row justify-between items-center'>
					<Text className='text-xl'>{videoInfo?.title}</Text>
					<Pressable
						onPress={() => {
							setOpenState(!isOpen);
						}}>
						<FeatherIcon name={`${isOpen ? 'chevron-down' : 'chevron-up'}`} />
					</Pressable>
				</TransparentView>
				<AnimatePresence>
					{isOpen && (
						<MotiView
							className='mt-2'
							from={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
							}}>
							<Text>{videoInfo?.introduction}</Text>
						</MotiView>
					)}
				</AnimatePresence>
			</TransparentView>
		</TransparentView>
	);
};

export const LiveMessageRenderItem = (props: {
	item: LiveMessage;
	index: number;
}) => {
	const { item } = props;

	return (
		<BlurView
			intensity={120}
			className='px-4 py-2 rounded-lg overflow-hidden'>
			<Text className='text-base'>
				<Text className='font-bold'>{`${item.username}:  `}</Text>
				{item.message}
			</Text>
		</BlurView>
	);
};

export const LiveChatContainer = () => {
	const { liveId } = useLocalSearchParams();
	const inputRef = useRef<TextInput>(null);
	const flashListRef = useRef<FlashList<LiveMessage>>(null);

	const liveParam = useAppSelector(state => state.live);
	const [input, setInput] = useState<string>('');
	const [messageHistory, setMessageHistory] = useState<Partial<LiveMessage>[]>(
		[],
	);

	const handleOnMessage = (event: MessageEvent<any>) => {
		const message: LiveMessage = JSON.parse(event.data);
		if (message.system) {
			return;
		}
		if (message.message && message.message.trim().length > 0) {
			setMessageHistory(pre => {
				return [...pre, message];
			});
		}
		// if (message.amount > 0) {
		// 	insertToPayMessage(message);
		// }
	};

	const [webSocket] = useWebSocket(
		`/006774/1`,
		() => {},
		handleOnMessage,
		() => {},
	);

	// const insertToPayMessage = (data: LiveMessage) => {
	// 	let targetIndex = payHistory.length;
	// 	payHistory.some((item, index) => {
	// 		const flag = item.amount < data.amount;
	// 		if (flag) {
	// 			targetIndex = index;
	// 		}
	// 		return flag;
	// 	});
	// 	setPayHistory(pre => {
	// 		pre.splice(targetIndex, 0, data);
	// 		return [...pre];
	// 	});
	// };

	const handleCommit = async () => {
		if (input.length <= 0) {
			return;
		}
		console.log(liveParam);
		const liveMessage = {
			userId: liveParam.userId,
			profile: liveParam.profile,
			username: liveParam.username,
			roomId: liveId,
			message: input,
			system: false,
		};
		webSocket?.send(JSON.stringify(liveMessage));
		inputRef.current?.clear();
	};

	return (
		<BlurView
			className='flex-1 px-4 py-2 flex-col-reverse rounded-t-3xl overflow-hidden shadow-3xl'
			intensity={80}>
			<TransparentView
				className='w-full flex-row items-center'
				style={{
					columnGap: 10,
				}}>
				<TextInput
					className='flex-1 px-4 py-2 rounded-full'
					placeholder='Aha'
					ref={inputRef}
					style={{
						backgroundColor: secondBgColor,
					}}
					maxLength={50}
					value={input}
					onChangeText={setInput}
				/>
				<BaseBlurButton
					containerStyle={{
						width: 80,
					}}
					title='Commit'
					onPress={() => {
						handleCommit();
					}}
				/>
			</TransparentView>
			<TransparentView className='p-4 flex-1'>
				<FlashList
					ref={flashListRef}
					contentContainerStyle={{}}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => {
						return <TransparentView className='h-4' />;
					}}
					data={messageHistory as LiveMessage[]}
					keyExtractor={(item: LiveMessage, index) => {
						return index + item.userId + item.username;
					}}
					renderItem={({ item, index }) => {
						return (
							<LiveMessageRenderItem
								item={item}
								index={index}
							/>
						);
					}}
					estimatedItemSize={175}
				/>
			</TransparentView>
		</BlurView>
	);
};
