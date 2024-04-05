import {
	Dispatch,
	ForwardedRef,
	ReactNode,
	SetStateAction,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetModalProvider,
	BottomSheetTextInput,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { secondBgColor, secondaryColor } from '../constants/Colors';
import { BaseBlurButton, Text, TransparentView } from './Themed';
import { CheckBox } from '@rneui/base';
import {
	DateTimePickerAndroid,
	DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { dateFormat } from '@/utils/common/calculateUtil';
import { uploadSingleFile, uploadUserInfo } from '@/api/user';
import { router } from 'expo-router';
import { UploadUserInfo } from '@/.expo/types/auth';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Dialog } from '@rneui/themed';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import {
	getPlayList,
	getVideoInPlayList,
	updateVideoInPlayList,
} from '@/api/media';
import { useAppSelector } from '@/store/hook';
import { PlayList, PlayVideoList } from '@/.expo/types/media';

export const ExtendModal = forwardRef(
	(
		props: {
			children: ReactNode;
			onDismiss?: () => void;
			modalHeight?: number;
		},
		ref: ForwardedRef<BottomSheetModal>,
	) => {
		const { children, onDismiss, modalHeight } = props;

		const [bottomIndex, setBottomIndex] = useState(0);
		const modalRef = useRef<BottomSheetModal>(null);
		const snapPoints = useMemo(() => [modalHeight || 600], []);

		useImperativeHandle<Partial<BottomSheetModal>, Partial<BottomSheetModal>>(
			ref,
			() => ({
				present: modalRef.current!.present,
				dismiss: modalRef.current!.dismiss,
			}),
		);

		return (
			<BottomSheetModalProvider>
				<BottomSheetModal
					enableDynamicSizing
					ref={modalRef}
					index={bottomIndex}
					style={{
						borderRadius: 50,
					}}
					backgroundStyle={{
						backgroundColor: '#e7defa',
					}}
					maxDynamicContentSize={modalHeight || 600}
					backgroundComponent={() => {
						return (
							<LinearGradient
								colors={['#e9defa', '#ace0f9']}
								className='h-full w-full bottom-0 absolute rounded-t-[20]'
							/>
						);
					}}
					handleIndicatorStyle={{
						backgroundColor: secondaryColor,
					}}
					snapPoints={snapPoints}
					onDismiss={onDismiss}>
					<BottomSheetView
						style={{
							flex: 1,
						}}>
						{children}
					</BottomSheetView>
				</BottomSheetModal>
			</BottomSheetModalProvider>
		);
	},
);

export const ExtendBottomSheet = forwardRef(
	(
		props: {
			children: ReactNode;
			onClose?: () => void;
			modalHeight?: number;
		},
		ref: ForwardedRef<BottomSheet>,
	) => {
		const { children, onClose, modalHeight } = props;

		const [bottomIndex, setBottomIndex] = useState(-1);
		const bottomSheetRef = useRef<BottomSheet>(null);

		useImperativeHandle<Partial<BottomSheet>, Partial<BottomSheet>>(
			ref,
			() => ({
				expand: bottomSheetRef.current!.expand,
				close: bottomSheetRef.current!.close,
			}),
		);

		const BackdropComponent = useCallback(
			(props: any) => (
				<BottomSheetBackdrop
					appearsOnIndex={0}
					disappearsOnIndex={-1}
					{...props}
				/>
			),
			[],
		);

		return (
			<BottomSheet
				enableDynamicSizing
				ref={bottomSheetRef}
				index={bottomIndex}
				style={{
					borderRadius: 50,
				}}
				backgroundStyle={{
					backgroundColor: '#e7defa',
				}}
				snapPoints={['25%']}
				maxDynamicContentSize={modalHeight || 200}
				backdropComponent={BackdropComponent}
				backgroundComponent={() => {
					return (
						<LinearGradient
							colors={['#e9defa', '#ace0f9']}
							className='h-full w-full bottom-0 absolute rounded-t-[20]'
						/>
					);
				}}
				handleIndicatorStyle={{
					backgroundColor: secondaryColor,
				}}
				onClose={onClose}>
				<BottomSheetView
					style={{
						height: '100%',
						justifyContent: 'space-between',
					}}>
					{children}
				</BottomSheetView>
			</BottomSheet>
		);
	},
);

const updateUserInfo = (date: UploadUserInfo) => {
	uploadUserInfo(date).then(response => {
		const { result } = response;
		console.log(result);
		if (result) {
			router.replace('/(no-direct)/personal/information');
		}
	});
};

export const NewNameBottomSheet = () => {
	const [username, setUsername] = useState<string>('');

	return (
		<>
			<TransparentView
				className='flex-row justify-center items-center'
				style={{
					columnGap: 10,
				}}>
				<Text className='text-lg'>New Name: </Text>
				<BottomSheetTextInput
					style={{
						width: '70%',
						marginTop: 8,
						marginBottom: 10,
						borderRadius: 10,
						fontSize: 16,
						lineHeight: 20,
						padding: 8,
						backgroundColor: secondBgColor,
					}}
					maxLength={20}
					value={username}
					onChangeText={setUsername}
				/>
			</TransparentView>
			<TransparentView className='w-full items-center mb-4'>
				<BaseBlurButton
					containerStyle={{
						width: '80%',
					}}
					onPress={() => {
						if (username.length > 0) {
							updateUserInfo({ username });
						}
					}}>
					<Text>Save</Text>
				</BaseBlurButton>
			</TransparentView>
		</>
	);
};

export const ChangeProfileBottomSheet = (props: { profile: string }) => {
	const [profile, setProfile] = useState<ImagePicker.ImagePickerAsset>({
		uri: props.profile,
	} as ImagePicker.ImagePickerAsset);

	const pickImageAsync = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setProfile(result.assets[0]);
		}
	};

	const uploadAvatar = () => {
		const formData = new FormData();

		formData.append('file', {
			name: new Date().getMilliseconds() + Math.random() * 3600 + '.jpg',
			type: 'image/jpeg',
			uri:
				Platform.OS === 'android'
					? profile.uri
					: profile.uri.replace('file://', ''),
		} as any);

		uploadSingleFile(formData).then(response => {
			const { result } = response;
			if (result) {
				router.replace('/(no-direct)/personal/information');
			}
		});
	};

	return (
		<>
			<TransparentView
				className='flex-row justify-center items-center'
				style={{
					columnGap: 10,
				}}>
				<Avatar
					size={100}
					rounded
					source={{
						uri: `${profile.uri}`,
					}}
				/>
				<BaseBlurButton
					onPress={() => {
						pickImageAsync();
					}}>
					<Text>Select Image</Text>
				</BaseBlurButton>
			</TransparentView>
			<TransparentView className='w-full items-center mb-4'>
				<BaseBlurButton
					containerStyle={{
						width: '50%',
					}}
					onPress={() => {
						uploadAvatar();
					}}>
					<Text>Save</Text>
				</BaseBlurButton>
			</TransparentView>
		</>
	);
};

export const ChangeGenderBottomSheet = (props: { gender: number }) => {
	const genderList = ['Female', 'Male', 'Private'];
	const [selectedIndex, setSelectedIndex] = useState<number>(props.gender);

	return (
		<>
			<TransparentView
				className='flex-row justify-center items-center'
				style={{
					columnGap: 10,
				}}>
				{genderList.map((item, index) => (
					<CheckBox
						key={item}
						title={item}
						checked={selectedIndex === index}
						onPress={() => {
							setSelectedIndex(index);
						}}
						containerStyle={{
							backgroundColor: 'transparent',
						}}
						checkedColor={secondaryColor}
					/>
				))}
			</TransparentView>
			<TransparentView className='w-full items-center mb-4'>
				<BaseBlurButton
					containerStyle={{
						width: '80%',
					}}
					onPress={() => {
						if (selectedIndex !== props.gender) {
							updateUserInfo({ gender: selectedIndex });
						}
					}}>
					<Text>Save</Text>
				</BaseBlurButton>
			</TransparentView>
		</>
	);
};

export const ChangeBirthdayBottomSheet = (props: { birthday: string }) => {
	// const [pickerShow, setShowState] = useState<boolean>(false);
	const [birthday, setBirthday] = useState<Date>(new Date(props.birthday));

	// const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
	//   const {
	//     type,
	//     nativeEvent: { timestamp, utcOffset },
	//   } = event;
	//   if (type === 'dismissed') {
	//     return;
	//   }

	//   if (selectedDate) {
	//     setBirthday(selectedDate);
	//   }
	//   setShowState(false);
	// };

	const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
		if (selectedDate) {
			setBirthday(selectedDate);
		}
	};

	const showMode = () => {
		DateTimePickerAndroid.open({
			value: birthday,
			onChange,
			mode: 'date',
			is24Hour: true,
			maximumDate: new Date(),
		});
	};

	return (
		<>
			{/* {pickerShow && (
        <DateTimePicker
          testID='1'
          mode='date'
          is24Hour={false}
          value={new Date()}
          onChange={onChange}
          // maximumDate={new Date()}
        />
      )} */}
			<TransparentView
				className='flex-row justify-center items-center'
				style={{
					columnGap: 10,
				}}>
				<BaseBlurButton
					containerStyle={{
						width: '80%',
					}}
					onPress={() => {
						showMode();
						// setShowState(true);
					}}>
					<Text>{`${dateFormat(birthday)}`}</Text>
				</BaseBlurButton>
			</TransparentView>
			<TransparentView className='w-full items-center mb-4'>
				<BaseBlurButton
					containerStyle={{
						width: '80%',
					}}
					onPress={() => {
						if (birthday !== new Date(props.birthday)) {
							updateUserInfo({
								birthday: dateFormat(birthday, 'YYYY-MM-DD hh:mm:ss'),
							});
						}
					}}>
					<Text>Save</Text>
				</BaseBlurButton>
			</TransparentView>
		</>
	);
};

export const ChangeIntroductionBottomSheet = (props: {
	introduction: string;
}) => {
	const [introduction, setIntroduction] = useState<string>(props.introduction);

	return (
		<>
			<TransparentView
				className='flex-row justify-center items-center'
				style={{
					columnGap: 10,
				}}>
				<BottomSheetTextInput
					style={{
						width: '80%',
						marginTop: 8,
						marginBottom: 10,
						borderRadius: 10,
						fontSize: 16,
						lineHeight: 20,
						padding: 8,
						backgroundColor: secondBgColor,
					}}
					editable
					multiline
					numberOfLines={4}
					maxLength={200}
					value={introduction}
					onChangeText={setIntroduction}
				/>
			</TransparentView>
			<TransparentView className='w-full items-center mb-4'>
				<BaseBlurButton
					containerStyle={{
						width: '80%',
					}}
					onPress={() => {
						if (
							introduction.length > 0 &&
							introduction !== props.introduction
						) {
							updateUserInfo({ introduction });
						}
					}}>
					<Text>Save</Text>
				</BaseBlurButton>
			</TransparentView>
		</>
	);
};

export type ExtendPlayList = PlayList & { checked: boolean };

export const CollectionDialog = (props: {
	visibleState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
	const [isVisible, setVisibleState] = props.visibleState;
	const [originSelectedIndex, setOriginSelectedIndex] = useState<
		Partial<PlayVideoList>[]
	>([]);
	const [collectionList, setCollectionList] = useState<ExtendPlayList[]>([]);

	const [mutableCollection, setMutableCollection] = useState<ExtendPlayList[]>(
		[],
	);
	const deriveId = useAppSelector(state => state.chat.deriveId);

	const onBackdropPress = () => {
		setVisibleState(!isVisible);
	};

	const onCheckBoxPress = (index: number) => {
		setMutableCollection(previous => {
			previous[index].checked = !previous[index].checked;
			return [...previous];
		});
	};

	const updateVideoInCollection = () => {
		const changeTarget = mutableCollection
			.filter((_, index) => {
				return (
					collectionList[index].checked !== mutableCollection[index].checked
				);
			})
			.map(item => ({
				playListId: item.id,
			}));

		console.log(changeTarget);

		if (changeTarget.length > 0) {
			updateVideoInPlayList(deriveId, changeTarget);
		}

		onBackdropPress();
	};

	useEffect(() => {
		if (!isVisible) {
			setCollectionList([]);
			setOriginSelectedIndex([]);
			return;
		}
		const fetchPlayList = async () => {
			const { result: playListArray } = await getPlayList();
			await getVideoInPlayList(deriveId).then(response => {
				const { result } = response;
				setOriginSelectedIndex(result);

				playListArray.forEach((item: ExtendPlayList) => {
					item.checked = result.some(
						(innerItem: PlayVideoList) => innerItem.playListId === item.id,
					);
				});
				setMutableCollection(playListArray);

				const temp: ExtendPlayList[] = [];
				playListArray.forEach((item: ExtendPlayList) => {
					temp.push({ ...item });
				});
				setCollectionList(temp);
			});
		};
		fetchPlayList();
	}, [isVisible]);

	return (
		<Dialog
			overlayStyle={{
				padding: 0,
				backgroundColor: 'transparent',
				borderRadius: 20,
				overflow: 'hidden',
			}}
			isVisible={isVisible}
			onBackdropPress={onBackdropPress}>
			<LinearGradient
				colors={['#e9defa', '#ace0f9']}
				className='p-4'>
				<Dialog.Title
					title='Add to collection'
					titleStyle={{
						color: secondaryColor,
					}}
				/>
				{collectionList.map((item, index) => (
					<CheckBox
						key={item.id}
						checked={mutableCollection[index]?.checked ?? false}
						title={item.name}
						onPress={() => {
							onCheckBoxPress(index);
						}}
						containerStyle={{
							backgroundColor: 'transparent',
						}}
						checkedColor={secondaryColor}
					/>
				))}
				<BaseBlurButton
					containerStyle={{
						width: '60%',
						alignSelf: 'center',
						marginTop: 10,
					}}
					onPress={() => {
						updateVideoInCollection();
					}}>
					<Text className='font-semibold'>Save</Text>
				</BaseBlurButton>
			</LinearGradient>
		</Dialog>
	);
};
