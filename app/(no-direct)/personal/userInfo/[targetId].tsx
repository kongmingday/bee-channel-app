import { AllUserInfo, UserAndRelationship } from '@/constants/auth';
import { getUserFullInfo } from '@/api/user';
import { NotTabView } from '@/components/CommonView';
import { InformationList, UserInfoPage } from '@/components/InformationScreen';
import { Text } from '@/components/Themed';
import { useAppSelector } from '@/store/hook';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

export default function TargetScreen() {
	// router.push(`/(no-direct)/live-play/${item.id}`);
	const [userInfo, setUserInfo] = useState<UserAndRelationship>(
		{} as UserAndRelationship,
	);
	const { targetId } = useLocalSearchParams();
	const userInfoInStore = useAppSelector(state => state.app.userInfo);

	useFocusEffect(
		useCallback(() => {
			const getInfo = async () => {
				const { result: userInfo } = await getUserFullInfo(
					targetId as string,
					userInfoInStore?.id,
				);
				setUserInfo(userInfo);
			};
			getInfo();
		}, []),
	);

	return (
		<NotTabView
			contentStyle='px-5 '
			headerStyle='mb-5'
			headerComponent={<Text className='pr-3 text-lg'>User Information</Text>}>
			{userInfo.id && (
				<UserInfoPage
					userInfo={userInfo}
					setData={setUserInfo}
				/>
			)}
		</NotTabView>
	);
}
