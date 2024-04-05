import { FlashList } from '@shopify/flash-list';
import {
	BaseBlurButton,
	BaseButton,
	FeatherIcon,
	MaterialIcon,
	MaterialIconType,
	Text,
	TransparentView,
} from './Themed';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AnimatePresence, MotiView } from 'moti';
import {
	useEffect,
	useRef,
	useState,
	memo,
	RefObject,
	Dispatch,
	SetStateAction,
} from 'react';
import { Pressable, TextInput } from 'react-native';
import { Avatar } from '@rneui/themed';
import { BlurView } from 'expo-blur';
import { secondBgColor } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Comment, SimpleMedia } from '@/.expo/types/media';
import { PATH_CONSTANTS } from '@/.expo/types/constant';
import { calculateDuration, convertNumber } from '@/utils/common/calculateUtil';
import { useAppDispatch, useAppSelector, useFetchDataPage } from '@/store/hook';
import {
	commitComment,
	getCommentPage,
	getChildrenComment,
	favoriteAction,
} from '@/api/media';
import { DeriveType, FavoriteType } from '@/.expo/types/enum';
import {
	changeMainInputRef,
	changeParentId,
	changeSecondaryInputRef,
	changeUserToId,
} from '@/store/slices/chatSlice';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { LoadingComponent, NoMoreDataComponent } from './FlatListComponent';
import { useDispatch } from 'react-redux';
import { Link } from 'expo-router';
import { subscribeAction } from '@/api/user';
import { favoriteDataPackaging } from '@/utils/common/calculateUtil';
import { CollectionDialog } from './ExtendModal';

export const VideoPageDetail = (props: {
	videoInfo?: SimpleMedia;
	setVideoInfo: Dispatch<SetStateAction<SimpleMedia | undefined>>;
}) => {
	const [isOpen, setOpenState] = useState(false);
	const [isDialogVisible, setDialogState] = useState<boolean>(false);
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

	const handleFavoriteChange = (favoriteType: FavoriteType) => {
		favoriteAction({
			sourceId: videoInfo?.id!,
			deriveType: DeriveType.VIDEO,
			favoriteType,
			userToId: videoInfo?.authorId,
		}).then(response => {
			if (response.result) {
				setVideoInfo(pre => {
					const changeResult = favoriteDataPackaging(pre, favoriteType);
					return { ...changeResult };
				});
			}
		});
	};

	const handleCollectionPress = () => {};

	return (
		<TransparentView
			className='px-6 pt-3 flex-1'
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
					<TransparentView>
						<Text className='text-xl'>{videoInfo?.title}</Text>
						<Text>
							{`${convertNumber(videoInfo?.clickedCount)} views`} ·{' '}
							{`${calculateDuration(videoInfo?.publicTime)}`}
						</Text>
					</TransparentView>
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
			<TransparentView
				className='flex-row w-full'
				style={{
					shadowColor: 'black',
				}}>
				<BaseButton
					containerStyle={{
						backgroundColor: 'transparent',
					}}
					onPress={() => {
						handleFavoriteChange(FavoriteType.LIKE);
					}}>
					<MaterialIcon
						name={
							videoInfo?.favoriteType === FavoriteType.LIKE
								? 'thumb-up-alt'
								: 'thumb-up-off-alt'
						}
					/>
				</BaseButton>
				<BaseButton
					containerStyle={{
						backgroundColor: 'transparent',
					}}
					onPress={() => {
						handleFavoriteChange(FavoriteType.UNLIKE);
					}}>
					<MaterialIcon
						name={
							videoInfo?.favoriteType === FavoriteType.UNLIKE
								? 'thumb-down-alt'
								: 'thumb-down-off-alt'
						}
					/>
				</BaseButton>
				<BaseButton
					containerStyle={{
						backgroundColor: 'transparent',
					}}
					onPress={() => {
						setDialogState(true);
					}}>
					<MaterialIcon name='star-border' />
				</BaseButton>
				<CollectionDialog visibleState={[isDialogVisible, setDialogState]} />
			</TransparentView>
			{/* TODO RECOMMENDATION */}
			{/* <SimpleVideoList /> */}
		</TransparentView>
	);
};

export const CommentRenderItem = memo(
	(props: {
		item: Comment;
		index: number;
		isChildren: boolean;
		openModal?: () => void;
	}) => {
		const { item, isChildren, openModal } = props;

		const mainInputRef = useAppSelector(state => state.chat.mainInputRef);
		const secondaryInputRef = useAppSelector(
			state => state.chat.secondaryInputRef,
		);
		const dispatch = useDispatch();
		const [isOpen, setOpenState] = useState(false);

		const buttonAction: {
			name: MaterialIconType;
			onClick: () => void;
		}[] = [
			{
				name: 'thumb-up-off-alt',
				onClick: () => {},
			},
			{
				name: 'thumb-down-off-alt',
				onClick: () => {},
			},
			{
				name: 'chat-bubble-outline',
				onClick: () => {
					if (isChildren) {
						dispatch(changeUserToId(item.userFromId));
						secondaryInputRef?.current?.focus();
						return;
					}
					dispatch(changeParentId(item.id));
					mainInputRef?.current?.focus();
				},
			},
		];

		return (
			<BlurView
				className='px-4 py-4 rounded-xl overflow-hidden'
				style={{
					rowGap: 10,
				}}>
				<TransparentView
					className='flex-row'
					style={{
						columnGap: 10,
					}}>
					<Avatar
						size={40}
						rounded
						source={{
							uri: `${PATH_CONSTANTS}${item.fromUser.profile}`,
						}}
					/>
					<TransparentView>
						<Text>{item.fromUser.username}</Text>
						<Text>{calculateDuration(item.createTime)}</Text>
					</TransparentView>
				</TransparentView>
				<TransparentView
					className='ml-12'
					style={{
						rowGap: 10,
					}}>
					<TransparentView>
						<Pressable
							onPress={() => {
								setOpenState(!isOpen);
							}}>
							<AnimatePresence exitBeforeEnter>
								{isOpen && (
									<MotiView
										key={1}
										from={{
											opacity: 0,
										}}
										animate={{
											opacity: 1,
										}}
										exit={{
											opacity: 0,
										}}>
										<Text>
											{isChildren && item.toUser && (
												<Link href='/user'>{`@${item.toUser.username} : `}</Link>
											)}
											{item.content}
										</Text>
									</MotiView>
								)}
								{!isOpen && (
									<MotiView
										key={2}
										from={{
											opacity: 0,
										}}
										animate={{
											opacity: 1,
										}}
										exit={{
											opacity: 0,
										}}>
										<Text numberOfLines={2}>
											{isChildren && item.toUser && (
												<Link href='/user'>{`@${item.toUser.username} : `}</Link>
											)}
											{item.content}
										</Text>
									</MotiView>
								)}
							</AnimatePresence>
						</Pressable>
					</TransparentView>
					<TransparentView
						className='flex-row w-full items-center'
						style={{
							columnGap: 15,
						}}>
						{buttonAction.map(item => (
							<Pressable onPress={item.onClick}>
								<MaterialIcon
									name={item.name}
									size={20}
								/>
							</Pressable>
						))}
					</TransparentView>
					{!isChildren && item.childrenCount > 0 && (
						<Pressable onPress={() => {}}>
							<BlurView
								intensity={70}
								className='px-4 py-2 overflow-hidden'
								style={{
									rowGap: 10,
								}}>
								<Pressable
									className='flex-row items-center'
									onPress={() => {
										dispatch(changeParentId(item.id));
										openModal && openModal();
									}}>
									<Text>More replies</Text>
									<MaterialIcon
										name='chevron-right'
										size={20}
									/>
								</Pressable>
							</BlurView>
						</Pressable>
					)}
				</TransparentView>
			</BlurView>
		);
	},
	() => true,
);

export const VideoPageComment = (props: {
	modalRef?: RefObject<BottomSheetModal>;
	isChildren?: boolean;
}) => {
	const { modalRef, isChildren } = props;
	const deriveId = useAppSelector(state => state.chat.deriveId);
	const userToId = useAppSelector(state => state.chat.userToId);
	const parentId = useAppSelector(state => state.chat.parentId);
	const dispatch = useAppDispatch();

	const inputRef = useRef<TextInput>(null);
	const [input, setInput] = useState<string>('');
	const [sortedIndex, setSortedIndex] = useState<number>(0);
	const sortedArray = ['Most', 'Newest'];

	const {
		data,
		isRefreshing,
		isLoading,
		isNoMore,
		dataTotal,
		otherParams,
		fetchData,
		refreshPage,
		setOtherParams,
	} = isChildren
		? useFetchDataPage<Comment, any, any>(
				getChildrenComment,
				false,
				undefined,
				undefined,
				{
					parentId,
				},
		  )
		: useFetchDataPage<Comment, any, any>(
				getCommentPage,
				false,
				undefined,
				undefined,
				{
					videoId: deriveId,
					orderBy: sortedIndex,
				},
		  );

	const handleCommit = async () => {
		if (input.length <= 0) {
			return;
		}
		await commitComment({
			deriveId,
			deriveType: DeriveType.VIDEO,
			content: input,
			userToId: userToId,
			parentId: parentId,
		}).then(res => {
			if (res.result) {
				refreshPage();
				inputRef.current?.clear();
			}
		});
	};

	const handleSortedChange = () => {
		if (sortedIndex) {
			setSortedIndex(0);
		} else {
			setSortedIndex(1);
		}
	};

	useEffect(() => {
		if (isChildren) {
			dispatch(changeSecondaryInputRef(inputRef));
			return;
		}
		dispatch(changeMainInputRef(inputRef));
	}, []);

	useEffect(() => {
		setOtherParams({
			...otherParams,
			orderBy: sortedIndex,
		});
	}, [sortedIndex]);

	return (
		<TransparentView
			className='flex-1 p-4'
			style={{
				rowGap: 10,
			}}>
			{!isChildren && (
				<Pressable
					className='flex-row items-center '
					style={{
						columnGap: 5,
					}}
					onPress={handleSortedChange}>
					<Feather
						name='menu'
						size={20}
					/>
					<Text className='text-base'>{sortedArray[sortedIndex]}</Text>
				</Pressable>
			)}
			{isChildren ? (
				<BottomSheetFlatList
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					data={data}
					extraData={data}
					onEndReached={fetchData}
					onEndReachedThreshold={0}
					refreshing={isRefreshing}
					onRefresh={refreshPage}
					keyExtractor={(item: Comment, index) => {
						return index + item.id;
					}}
					renderItem={({ item, index }) => {
						return (
							<CommentRenderItem
								key={index + '-' + item.id}
								isChildren={isChildren || false}
								item={item}
								index={index}
								openModal={() => {
									modalRef?.current?.present();
								}}
							/>
						);
					}}
					ListEmptyComponent={
						isNoMore ? (
							<NoMoreDataComponent />
						) : (
							<TransparentView className='p-1' />
						)
					}
					ListFooterComponent={
						isNoMore ? (
							<NoMoreDataComponent />
						) : isLoading ? (
							<LoadingComponent />
						) : (
							<TransparentView className='p-1' />
						)
					}
					ItemSeparatorComponent={() => {
						return <TransparentView className='h-4' />;
					}}
				/>
			) : (
				<FlashList
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					data={data}
					extraData={data}
					estimatedItemSize={175}
					onEndReached={fetchData}
					refreshing={isRefreshing}
					onRefresh={refreshPage}
					keyExtractor={(item: Comment, index) => {
						return index + item.id;
					}}
					renderItem={({ item, index }) => {
						return (
							<CommentRenderItem
								key={index + '-' + item.id}
								isChildren={isChildren || false}
								item={item}
								index={index}
								openModal={() => {
									modalRef?.current?.present();
								}}
							/>
						);
					}}
					ListEmptyComponent={
						isNoMore && dataTotal > 0 ? (
							<NoMoreDataComponent />
						) : (
							<TransparentView className='p-1' />
						)
					}
					ListFooterComponent={
						isNoMore ? (
							<NoMoreDataComponent />
						) : isLoading ? (
							<LoadingComponent />
						) : (
							<TransparentView className='p-1' />
						)
					}
					ItemSeparatorComponent={() => {
						return <TransparentView className='h-4' />;
					}}
				/>
			)}
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
		</TransparentView>
	);
};
