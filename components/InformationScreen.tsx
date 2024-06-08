import { BlurView } from 'expo-blur';
import { TransparentView, FeatherIcon, Text, BaseBlurButton } from './Themed';
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react';
import { Avatar, TabView } from '@rneui/base';
import { ScrollView } from 'moti';
import { dateFormat } from '@/utils/common/calculateUtil';
import {
	ChangeBirthdayBottomSheet,
	ChangeGenderBottomSheet,
	ChangeIntroductionBottomSheet,
	ChangePasswordBottomSheet,
	ChangeProfileBottomSheet,
	ExtendBottomSheet,
	NewNameBottomSheet,
} from './ExtendModal';
import BottomSheet from '@gorhom/bottom-sheet';
import { Pressable } from 'react-native';
import { AllUserInfo, UserAndRelationship } from '@/constants/auth';
import { PATH_CONSTANTS } from '@/constants/constant';
import { BackgroundView } from './CommonView';
import { Image } from 'expo-image';
import { subscribeAction } from '@/api/user';
import { Tab } from '@rneui/themed';
import { secondaryColor } from '@/constants/Colors';
import { SearchVideoTab } from './SearchScreen';
import { SimpleVideoList } from './VideoAssembly';
import { useAppDispatch, useFetchDataPage } from '@/store/hook';
import { getAuthorVideoList } from '@/api/media';
import { SimpleMedia } from '@/constants/media';
import { handleShowToast } from '@/store/assembly/appAssembly';

export const InformationListItem = (props: {
	title?: ReactNode;
	iconWithComponent?: ReactNode;
	disableIcon?: boolean;
}) => {
	const { title, iconWithComponent, disableIcon } = props;

	return (
		<BlurView className='flex-row justify-between items-center mb-3 p-4 rounded-xl overflow-hidden '>
			{title}
			<TransparentView
				className='flex-row items-center'
				style={{
					columnGap: 10,
				}}>
				{iconWithComponent}
				{!disableIcon && (
					<FeatherIcon
						size={28}
						name='chevron-right'
					/>
				)}
			</TransparentView>
		</BlurView>
	);
};

export const InformationList = (props: { userInfo: AllUserInfo }) => {
	const { userInfo } = props;

	const modalRef = useRef<BottomSheet>(null);

	const genderList = ['Female', 'Male', 'Private'];
	const informationMap = [
		{
			title: <Text className='text-lg'>UID</Text>,
			iconWithComponent: (
				<Text
					className='text-lg text-gray-400 max-w-40 mr-4'
					numberOfLines={1}>
					{userInfo?.id}
				</Text>
			),
			disableIcon: true,
		},
		{
			title: <Text className='text-lg'>Profile</Text>,
			iconWithComponent: (
				<Avatar
					size={65}
					rounded
					source={{
						uri: `${PATH_CONSTANTS}${userInfo.profile}`,
					}}
				/>
			),
			onPress: () => {
				modalRef.current?.expand();
			},
			extendComponent: (
				<ChangeProfileBottomSheet
					profile={`${PATH_CONSTANTS}${userInfo.profile}`}
				/>
			),
		},
		{
			title: <Text className='text-lg'>Username</Text>,
			iconWithComponent: (
				<Text
					className='text-lg text-gray-400 max-w-[200]'
					numberOfLines={1}>
					{userInfo?.username}
				</Text>
			),
			onPress: () => {
				modalRef.current?.expand();
			},
			extendComponent: <NewNameBottomSheet />,
		},
		{
			title: <Text className='text-lg'>Gender</Text>,
			iconWithComponent: (
				<Text
					className='text-lg text-gray-400'
					numberOfLines={1}>
					{genderList[userInfo?.gender ?? 2]}
				</Text>
			),
			onPress: () => {
				modalRef.current?.expand();
			},
			extendComponent: (
				<ChangeGenderBottomSheet gender={userInfo?.gender ?? 2} />
			),
		},
		{
			title: <Text className='text-lg'>Birthday</Text>,
			iconWithComponent: (
				<Text
					className='text-lg text-gray-400'
					numberOfLines={1}>
					{dateFormat(userInfo?.birthday || '')}
				</Text>
			),
			onPress: () => {
				modalRef.current?.expand();
			},
			extendComponent: (
				<ChangeBirthdayBottomSheet
					birthday={userInfo?.birthday ?? new Date().toString()}
				/>
			),
		},
		{
			title: <Text className='text-lg'>Change Password</Text>,
			iconWithComponent: <></>,
			onPress: () => {
				modalRef.current?.expand();
			},
			extendComponent: <ChangePasswordBottomSheet email={userInfo.email} />,
		},
	];

	const [index, setIndex] = useState<number>(0);

	return (
		<>
			<ScrollView>
				{informationMap.map((item, index) => (
					<Pressable
						onPress={() => {
							setIndex(index);
							item.onPress && item.onPress();
						}}>
						<InformationListItem
							key={index}
							title={item.title}
							iconWithComponent={item.iconWithComponent}
							disableIcon={item.disableIcon}
						/>
					</Pressable>
				))}
			</ScrollView>
			<ExtendBottomSheet ref={modalRef}>
				{informationMap[index].extendComponent}
			</ExtendBottomSheet>
		</>
	);
};

export const UserInfoPage = (props: {
	userInfo: UserAndRelationship;
	setData: Dispatch<SetStateAction<UserAndRelationship>>;
}) => {
	const { userInfo, setData } = props;
	const dispatch = useAppDispatch();

	const [index, setIndex] = useState(0);
	const fetchFunction = useFetchDataPage<SimpleMedia>(
		getAuthorVideoList,
		false,
		undefined,
		undefined,
		{
			authorId: userInfo.id,
		},
	);

	const handleSubscribeChange = () => {
		subscribeAction(userInfo.id)
			.then(response => {
				if (response.result) {
					setData({
						...userInfo,
						hasConcern: !userInfo.hasConcern,
					});
				}
			})
			.catch(() => {
				handleShowToast(dispatch, 'Pleas login first');
			});
	};

	return (
		<>
			<BackgroundView className='flex-1 pt-2'>
				<TransparentView className='px-2 pb-2 flex-row justify-between items-center'>
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
					<BaseBlurButton
						containerStyle={{
							width: 120,
						}}
						title={`${userInfo.hasConcern ? 'Unsubscribe' : 'Subscribe'}`}
						onPress={handleSubscribeChange}
					/>
				</TransparentView>
				<TransparentView className='flex-1'>
					<TransparentView>
						<TransparentView className='w-24'>
							<Tab
								value={index}
								onChange={setIndex}
								containerStyle={{
									height: 50,
								}}
								titleStyle={{
									fontSize: 14,
									color: secondaryColor,
								}}
								indicatorStyle={{
									backgroundColor: secondaryColor,
									width: '60%',
									left: '20%',
								}}>
								<Tab.Item title={'Video'} />
							</Tab>
						</TransparentView>
					</TransparentView>
					<TabView
						value={index}
						onChange={setIndex}>
						<TabView.Item className='flex-1'>
							<SimpleVideoList
								fetchFunction={fetchFunction}
								fromAuthor
							/>
						</TabView.Item>
					</TabView>
				</TransparentView>
			</BackgroundView>
		</>
	);
};
