import { LinearGradient } from 'expo-linear-gradient';
import { Text, TransparentView } from '@/components/Themed';
import {
	SubscriptionAuthorList,
	SubscriptionVideoList,
} from '@/components/SubscriptionScreen';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppDispatch } from '@/store/hook';
import { useCallback, useState } from 'react';
import { UserInfo } from '@/.expo/types/auth';
import { useFocusEffect } from 'expo-router';
import { getUserInfo } from '@/api/user';
import { changeUserInfo } from '@/store/slices/appSlice';
import { LoginScreen } from '@/components/CommonView';
import { setProfile, setUsername } from '@/store/slices/liveSlice';

export default function SubscriptionScreen() {
	const tabBarHeight = useBottomTabBarHeight();
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
		<TransparentView className='flex-1 bg-transparent'>
			{userInfo ? (
				<LinearGradient
					colors={['#e9defa', '#ace0f9']}
					className='flex-1 px-4'
					style={{
						paddingBottom: tabBarHeight,
					}}>
					<Text className='text-xl my-4'>Subscription</Text>
					<SubscriptionAuthorList />
					<SubscriptionVideoList />
				</LinearGradient>
			) : (
				<LoginScreen />
			)}
		</TransparentView>
	);
}
