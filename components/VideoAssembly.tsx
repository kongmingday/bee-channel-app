import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { TransparentView, Text, BaseBlurButton, IonIcon } from './Themed'
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { Avatar } from '@rneui/themed'
import { ignoreTextColor } from '@/constants/Colors'
import {
	FetchDataPageReturn,
	useAppDispatch,
	useAppSelector,
	useFetchDataPage,
} from '@/store/hook'
import {
	EmptyDataComponent,
	LoadingComponent,
	NoMoreDataComponent,
} from './FlatListComponent'
import { SimpleMedia } from '@/constants/media'
import { convertNumber, dateFormat } from '@/utils/common/calculateUtil'
import { PATH_CONSTANTS } from '@/constants/constant'
import { AllUserInfo, UserAndRelationship } from '@/constants/auth'
import { getUserInfo, subscribeAction } from '@/api/user'
import {
	Dispatch,
	ReactElement,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react'
import { Pressable } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { changeDeriveId } from '@/store/slices/chatSlice'
import { getRecommendByUser } from '@/api/media'
import { ActiveLiveInfo } from '@/constants/live'
import { getActiveLivePage } from '@/api/live'
import { DeleteVideoInCollectionDialog } from './ExtendModal'
import { handleShowToast } from '@/store/assembly/appAssembly'
import {
	setProfile,
	setRoomId,
	setUserId,
	setUsername,
} from '@/store/slices/liveSlice'

export const SimpleVideoRenderItem = (props: {
	item: SimpleMedia
	index: number
	isFavorites?: boolean
	playListId?: string
	fromAuthor?: boolean
	filter?: Dispatch<SetStateAction<any[]>>
}) => {
	const { item, fromAuthor, playListId, isFavorites, filter } = props
	const [isVisible, setVisibleState] = useState<boolean>(false)

	const reset = (videoId: string) => {
		filter && filter((pre) => pre.filter((item) => item.id !== videoId))
	}

	return (
		<>
			<DeleteVideoInCollectionDialog
				playListId={playListId!}
				videoId={item.id}
				visibleState={[isVisible, setVisibleState]}
				filter={reset}
			/>
			<BlurView
				intensity={80}
				className='py-4 px-2 overflow-hidden flex-row rounded-2xl'
				style={{
					columnGap: 12,
				}}>
				<Image
					className='w-[40%] h-[100] ml-2 rounded-lg'
					source={`${PATH_CONSTANTS}${item.coverPath}`}
				/>
				<TransparentView className='justify-between flex-1'>
					<Text
						className='text-base '
						numberOfLines={2}>
						{item.title}
					</Text>
					<TransparentView className='gap-y-2'>
						{!fromAuthor && (
							<TransparentView className='flex-row items-center gap-x-2'>
								<Feather
									name='user'
									className='mr-2'
									size={18}
								/>
								<Text>{item.author.username}</Text>
							</TransparentView>
						)}
						<TransparentView className='flex-row items-center gap-x-2'>
							<Feather
								name='play-circle'
								className='mr-2'
								size={18}
							/>
							<Text>
								{`${item.clickedCount} views ·` +
									` ${dateFormat(item.publicTime, 'YYYY-MM-DD')}`}
							</Text>
						</TransparentView>
					</TransparentView>
				</TransparentView>
				{isFavorites && (
					<Pressable
						onPress={() => {
							setVisibleState(true)
						}}>
						<IonIcon
							name='close'
							size={18}
							color={'#000'}
						/>
					</Pressable>
				)}
			</BlurView>
		</>
	)
}

export const SimpleAuthorRenderItem = (props: {
	item: UserAndRelationship
	index: number
	setData: Dispatch<SetStateAction<any[]>>
}) => {
	const { item, index, setData } = props
	const dispatch = useAppDispatch()

	const handleSubscribeChange = () => {
		subscribeAction(item.id)
			.then((response) => {
				if (response.result) {
					setData((pre: any[]) => {
						const temp = [...pre]
						temp[index] = {
							...temp[index],
							hasConcern: !temp[index].hasConcern,
						}
						return temp
					})
				}
			})
			.catch(() => {
				handleShowToast(dispatch, 'Pleas login first')
			})
	}

	return (
		<BlurView
			className='flex-row p-4 rounded-xl overflow-hidden justify-between items-center'
			intensity={80}>
			<Avatar
				size={50}
				rounded
				source={{
					uri: `${PATH_CONSTANTS}${item.profile}`,
				}}
			/>
			<TransparentView className='flex-1 mx-4'>
				<Text
					className='mb-1'
					numberOfLines={1}>
					{item.username}
				</Text>
				<Text
					className='text-xs'
					numberOfLines={1}
					style={{
						color: ignoreTextColor,
					}}>
					{item.introduction}
				</Text>
			</TransparentView>
			<BaseBlurButton
				radius='rounded-xl'
				intensity={150}
				fontSize={13}
				containerStyle={{
					width: 100,
				}}
				onPress={handleSubscribeChange}>
				{item.hasConcern ? 'Unsubscribe' : 'Subscribe'}
			</BaseBlurButton>
		</BlurView>
	)
}

export const SimpleAuthorList = () => {
	const {
		data,
		isRefreshing,
		isLoading,
		isNoMore,
		dataTotal,
		setData,
		fetchData,
		refreshPage,
	} = useAppSelector((state) => state.search.fetchUserFunction)!

	return (
		<TransparentView className='flex-1 px-2'>
			<FlashList
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				data={data}
				keyExtractor={(item, index) => {
					return index + item.id
				}}
				onEndReached={fetchData}
				refreshing={isRefreshing}
				estimatedItemSize={90}
				onRefresh={refreshPage}
				renderItem={({ item, index }) => {
					return (
						<SimpleAuthorRenderItem
							item={item}
							index={index}
							setData={setData}
						/>
					)
				}}
				ListHeaderComponent={<TransparentView className='h-2' />}
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
					return <TransparentView className='h-2' />
				}}
			/>
		</TransparentView>
	)
}

export const SimpleVideoList = (props: {
	fetchFunction?: FetchDataPageReturn<SimpleMedia, any>
	headerComponent?: ReactElement
	isFavorites?: boolean
	playListId?: string
	fromAuthor?: boolean
}) => {
	const {
		fromAuthor,
		fetchFunction,
		headerComponent,
		isFavorites,
		playListId,
	} = props
	const dispatch = useAppDispatch()

	const {
		data,
		setData,
		isRefreshing,
		isLoading,
		isNoMore,
		dataTotal,
		fetchData,
		refreshPage,
	} =
		fetchFunction || useAppSelector((state) => state.search.fetchVideoFunction)!

	return (
		<FlashList
			nestedScrollEnabled
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			data={data}
			estimatedItemSize={135}
			keyExtractor={(item, index) => {
				return index + item.id
			}}
			onEndReached={fetchData}
			refreshing={isRefreshing}
			onRefresh={refreshPage}
			renderItem={({ item, index }) => {
				return (
					<Pressable
						onPress={() => {
							dispatch(changeDeriveId(item.id))
							router.push(`/(no-direct)/video-play/${item.id}`)
						}}>
						<SimpleVideoRenderItem
							isFavorites={isFavorites}
							playListId={playListId}
							item={item}
							index={index}
							filter={setData}
							fromAuthor={fromAuthor}
						/>
					</Pressable>
				)
			}}
			ListHeaderComponent={
				headerComponent || <TransparentView className='h-2' />
			}
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
				return <TransparentView className='h-2' />
			}}
		/>
	)
}

export const RecommendVideoList = () => {
	const dispatch = useAppDispatch()
	const [recommendation, setRecommendation] = useState<SimpleMedia[]>([])
	const [isRefreshing, setRefreshState] = useState<boolean>(false)

	const fetchData = async () => {
		setRefreshState(true)
		await getRecommendByUser(8)
			.then((response) => {
				const { result } = response
				setRecommendation(result)
			})
			.finally(() => {
				setRefreshState(false)
			})
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<FlashList
			nestedScrollEnabled
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			data={recommendation}
			estimatedItemSize={135}
			keyExtractor={(item, index) => {
				return index + item.id
			}}
			refreshing={isRefreshing}
			onRefresh={fetchData}
			renderItem={({ item, index }) => {
				return (
					<Pressable
						onPress={() => {
							dispatch(changeDeriveId(item.id))
							router.push(`/(no-direct)/video-play/${item.id}`)
						}}>
						<SimpleVideoRenderItem
							item={item}
							index={index}
						/>
					</Pressable>
				)
			}}
			ListHeaderComponent={<TransparentView className='h-2' />}
			ItemSeparatorComponent={() => {
				return <TransparentView className='h-2' />
			}}
			ListFooterComponent={<TransparentView className='h-2' />}
		/>
	)
}

export const LiveList = () => {
	const dispatch = useAppDispatch()
	const [userInfo, setUserInfo] = useState<AllUserInfo>({} as AllUserInfo)

	useFocusEffect(
		useCallback(() => {
			const getInfo = async () => {
				const { result: userInfo } = await getUserInfo()
				setUserInfo(userInfo)
			}
			getInfo()
		}, []),
	)

	const {
		data,
		isRefreshing,
		isLoading,
		isNoMore,
		dataTotal,
		fetchData,
		refreshPage,
	} = useFetchDataPage<SimpleMedia & ActiveLiveInfo, SimpleMedia, any>(
		getActiveLivePage,
		true,
		(data) => {
			const convert = data.map((item) => {
				return {
					...item,
					coverPath: item.cover,
					author: {
						id: item.userId,
						username: item.username,
						profile: item.profile,
					} as UserAndRelationship,
				}
			})
			return convert
		},
	)

	return (
		<FlashList
			nestedScrollEnabled
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			data={data}
			estimatedItemSize={135}
			keyExtractor={(item, index) => {
				return index + item.id
			}}
			onEndReached={fetchData}
			refreshing={isRefreshing}
			onRefresh={refreshPage}
			renderItem={({ item, index }) => {
				return (
					<Pressable
						onPress={() => {
							dispatch(changeDeriveId(item.id))
							dispatch(setRoomId(item.id))
							dispatch(setUserId(userInfo.id))
							dispatch(setProfile(userInfo.profile))
							dispatch(setUsername(userInfo.username))
							router.push(`/(no-direct)/live-play/${item.id}`)
						}}>
						<SimpleVideoRenderItem
							item={item}
							index={index}
						/>
					</Pressable>
				)
			}}
			ListHeaderComponent={<TransparentView className='h-2' />}
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
				return <TransparentView className='h-2' />
			}}
		/>
	)
}
