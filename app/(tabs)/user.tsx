import { Image } from 'expo-image';
import { Text, TransparentView, FeatherIcon } from '@/components/Themed';
import { Link, useFocusEffect } from 'expo-router';
import { SelectionArea, UserTabActionArea } from '@/components/UserScreen';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { getUserInfo } from '@/api/user';
import { useCallback, useState } from 'react';
import { UserInfo } from '@/.expo/types/auth';
import { PATH_CONSTANTS } from '@/.expo/types/constant';
import { useWindowDimensions } from 'react-native';
import { useAppDispatch } from '@/store/hook';
import { changeUserInfo } from '@/store/slices/appSlice';
import { BackgroundView, LoginScreen } from '@/components/CommonView';
import { setProfile, setUsername } from '@/store/slices/liveSlice';

const UserInfoScreen = (props: { userInfo?: UserInfo }) => {
	const { userInfo } = props;

	const tabBarHeight = useBottomTabBarHeight();

	return (
		<BackgroundView
			className='flex-1 pt-2 px-4'
			style={{
				paddingBottom: tabBarHeight,
			}}>
			<TransparentView className='px-2 pt-4 pb-6 flex-row justify-between items-center'>
				<TransparentView
					className='flex-row items-center'
					style={{ gap: 16 }}>
					<Image
						className='w-16 h-16 rounded-full'
						source={`${PATH_CONSTANTS}${userInfo?.profile}`}
					/>
					<TransparentView>
						<Text className='text-xl'>{userInfo?.username}</Text>
						<Text
							className='text-sm text-gray-400'
							numberOfLines={1}>{`@Username`}</Text>
					</TransparentView>
				</TransparentView>
				<Link
					href={`/(no-direct)/personal/information`}
					className='mr-3'
					asChild>
					<FeatherIcon
						size={28}
						name='chevron-right'
					/>
				</Link>
			</TransparentView>
			<TransparentView
				className='flex-1 items-center'
				style={{ gap: 16 }}>
				<UserTabActionArea />
				<SelectionArea />
			</TransparentView>
		</BackgroundView>
	);
};

export default function UserScreen() {
	const { width, height } = useWindowDimensions();
	const dispatch = useAppDispatch();
	const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

	useFocusEffect(
		useCallback(() => {
			const getInfo = async () => {
				const { result: userInfo } = await getUserInfo();
				setUserInfo(userInfo);
				dispatch(changeUserInfo(userInfo));
				dispatch(setUsername(userInfo.username));
				dispatch(setProfile(userInfo.profile));
			};
			getInfo();
		}, []),
	);

	return (
		<TransparentView
			style={{
				width,
				height: height,
			}}>
			{userInfo ? <UserInfoScreen userInfo={userInfo} /> : <LoginScreen />}
		</TransparentView>
	);
}
