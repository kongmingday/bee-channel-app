import {
	TransparentView,
	MaterialIcon,
	FontistoIcon,
	IonIcon,
	MaterialCommunityIcon,
	Text,
	BaseBlurButton,
	FeatherIcon,
} from './Themed';
import { Avatar } from '@rneui/themed';
import { SearchBar } from '@rneui/themed';
import { Tab, TabView } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { tintColorLight } from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { changeKeyword } from '@/store/slices/searchSlice';
import { Pressable } from 'react-native';
import { RecommendVideoList, LiveList } from './VideoAssembly';

export const HomeHeader = () => {
	const keyword = useAppSelector(state => state.search.keyword);
	const dispatch = useAppDispatch();

	return (
		<TransparentView
			className='flex-row items-center justify-center px-4 pt-4'
			style={{
				columnGap: 5,
			}}>
			<Image
				className='w-12 h-12 rounded-full'
				source={require('@/assets/images/logo.png')}
			/>
			<SearchBar
				lightTheme
				value={keyword}
				onChangeText={value => {
					dispatch(changeKeyword(value));
				}}
				containerStyle={{
					backgroundColor: 'transparent',
					flex: 1,
					borderBlockColor: 'transparent',
				}}
				inputContainerStyle={{
					borderRadius: 50,
					backgroundColor: '#fff',
					height: 40,
				}}
			/>
			<BaseBlurButton
				radius='rounded-xl'
				onPress={() => {
					router.push('/(no-direct)/search');
				}}>
				Search
			</BaseBlurButton>
		</TransparentView>
	);
};

export const RecommendScreenRenderItem = ({
	item,
	index,
}: {
	item: any;
	index: number;
}) => {
	return (
		<BlurView
			className='flex-1 m-1 p-2 overflow-hidden rounded-lg'
			style={{
				rowGap: 5,
			}}
			intensity={50}>
			<Image
				className='flex-1 h-[120] rounded-lg'
				source={`http://192.168.25.128:9000/bee-channel/image/1.png`}
			/>
			<TransparentView
				className='flex-1 px-2'
				style={{
					rowGap: 4,
				}}>
				<Text numberOfLines={2}>
					Title Title Title Title Title Title Title Title Title Title Title
					Title Title
				</Text>
				<TransparentView
					className='flex-row items-center'
					style={{
						columnGap: 5,
					}}>
					<FeatherIcon
						name='user'
						size={15}
					/>
					<Text
						numberOfLines={1}
						className='w-[80%]'>
						Username
					</Text>
				</TransparentView>
			</TransparentView>
		</BlurView>
	);
};

export const RecommendScreen = () => {
	return <RecommendVideoList />;
};

export const LiveScreen = () => {
	return <LiveList />;
};

export const CategoryScreen = () => {
	const categoryIcons = [
		{
			name: 'Music',
			icon: (
				<MaterialIcon
					name='music-note'
					size={40}
				/>
			),
		},
		{
			name: 'Movies',
			icon: (
				<MaterialIcon
					name='movie'
					size={40}
				/>
			),
		},
		{
			name: 'Tech',
			icon: (
				<MaterialIcon
					name='biotech'
					size={40}
				/>
			),
		},
		{
			name: 'Gaming',
			icon: (
				<MaterialIcon
					name='videogame-asset'
					size={40}
				/>
			),
		},
		{
			name: 'Life',
			icon: (
				<MaterialIcon
					name='nightlife'
					size={40}
				/>
			),
		},
		{
			name: 'Learning',
			icon: (
				<MaterialIcon
					name='menu-book'
					size={40}
				/>
			),
		},
		{
			name: 'News',
			icon: (
				<IonIcon
					name='newspaper-outline'
					size={40}
				/>
			),
		},
		{
			name: 'Dancing',
			icon: (
				<MaterialCommunityIcon
					name='dance-ballroom'
					size={40}
				/>
			),
		},
	];

	const dispatch = useAppDispatch();

	return (
		<FlashList
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			data={categoryIcons}
			extraData={categoryIcons}
			estimatedItemSize={175}
			numColumns={3}
			keyExtractor={item => {
				return item.name;
			}}
			renderItem={({ item, index }) => {
				return (
					<Pressable
						className='flex-1 m-4 h-28'
						onPress={() => {
							router.push({
								pathname: `/search`,
								params: {
									categoryId: index + 1,
								},
							});
						}}>
						<BlurView className='flex-1 justify-center items-center rounded-xl overflow-hidden'>
							{item.icon}
							<Text className='font-medium'>{item.name}</Text>
						</BlurView>
					</Pressable>
				);
			}}
		/>
	);
};

export const HomeSelectTab = () => {
	const [index, setIndex] = useState(0);
	const tabIconMap = [
		{
			index: 0,
			name: 'slightly-smile',
			icon: (
				<FontistoIcon
					name={'slightly-smile'}
					ignore={0 !== index}
					size={30}
				/>
			),
		},

		{
			index: 1,
			name: 'live-tv',
			icon: (
				<MaterialIcon
					name={'live-tv'}
					ignore={1 !== index}
					size={30}
				/>
			),
		},
		{
			index: 2,
			name: 'category',
			icon: (
				<MaterialIcon
					name={'category'}
					ignore={2 !== index}
					size={30}
				/>
			),
		},
	];

	return (
		<TransparentView className='flex-1 mt-1 overflow-hidden'>
			<TransparentView
				className='flex-0 justify-center px-28'
				style={{
					columnGap: 30,
					borderColor: 'rgba(0, 0, 0, 0.1)',
					borderBottomWidth: 1,
				}}>
				<Tab
					value={index}
					onChange={setIndex}
					titleStyle={{
						color: '#fff',
					}}
					indicatorStyle={{
						backgroundColor: tintColorLight,
						width: '20%',
						left: '7%',
					}}>
					{tabIconMap.map(item => (
						<Tab.Item key={item.name}>{item.icon}</Tab.Item>
					))}
				</Tab>
			</TransparentView>
			<TabView
				value={index}
				onChange={setIndex}>
				<TabView.Item className='flex-1 px-2'>
					<RecommendScreen />
				</TabView.Item>
				<TabView.Item className='flex-1'>
					<LiveScreen />
				</TabView.Item>
				<TabView.Item className='flex-1'>
					<CategoryScreen />
				</TabView.Item>
			</TabView>
		</TransparentView>
	);
};
