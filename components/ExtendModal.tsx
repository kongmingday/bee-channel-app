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
import { UploadUserInfo } from '@/constants/auth';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Dialog } from '@rneui/themed';
import { Platform, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import {
	buildPlayList,
	deleteFromPlayList,
	deletePlayList,
	getPlayList,
	getVideoInPlayList,
	updatePlayList,
	updateVideoInPlayList,
} from '@/api/media';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { PlayList, PlayVideoList } from '@/constants/media';
import { BackgroundView } from './CommonView';
import { handleShowToast } from '@/store/assembly/appAssembly';
import { useDispatch } from 'react-redux';
import { Dispatch as DispatchRedux } from '@reduxjs/toolkit';
import { sendCodeToEmail, verify } from '@/api/checkcode';
import { VERIFY_KEY } from '@/constants/constant';

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
							<BackgroundView className='h-full w-full bottom-0 absolute rounded-t-[20]' />
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
						<BackgroundView className='h-full w-full bottom-0 absolute rounded-t-[20]' />
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

const updateUserInfo = (date: UploadUserInfo, dispatch: DispatchRedux) => {
	uploadUserInfo(date).then(response => {
		const { result } = response;
		if (result) {
			handleShowToast(dispatch, 'update successfully');
			router.replace('/(no-direct)/personal/information');
		} else {
			handleShowToast(dispatch, 'update failed');
		}
	});
};

export const NewNameBottomSheet = () => {
	const dispatch = useAppDispatch();
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
							updateUserInfo({ username }, dispatch);
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
	const dispatch = useAppDispatch();
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
							updateUserInfo({ gender: selectedIndex }, dispatch);
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
	const dispatch = useAppDispatch();
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
							updateUserInfo(
								{
									birthday: dateFormat(birthday, 'YYYY-MM-DD hh:mm:ss'),
								},
								dispatch,
							);
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
	const dispatch = useAppDispatch();
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
							updateUserInfo({ introduction }, dispatch);
						}
					}}>
					<Text>Save</Text>
				</BaseBlurButton>
			</TransparentView>
		</>
	);
};

export const ChangePasswordBottomSheet = (props: { email?: string }) => {
	const { email } = props;

	const dispatch = useAppDispatch();
	const [code, setCode] = useState<string>('');
	const [input, setInputText] = useState<string>('');

	const fetchEmailCode = () => {
		sendCodeToEmail(email || '');
	};

	const onSavePress = async () => {
		const verifyResult = await verify(VERIFY_KEY + email, code);
		if (!verifyResult) {
			handleShowToast(dispatch, 'The verify code has error.');
			return;
		}
		if (input.length > 0 && input.length < 50) {
			updateUserInfo({ newPassword: input }, dispatch);
		}
	};

	return (
		<>
			<TransparentView
				className='px-10 flex-row justify-center items-center'
				style={{
					columnGap: 10,
				}}>
				<BottomSheetTextInput
					style={{
						width: '100%',
						marginTop: 8,
						marginBottom: 10,
						borderRadius: 10,
						fontSize: 16,
						lineHeight: 20,
						padding: 8,
						backgroundColor: secondBgColor,
					}}
					editable
					maxLength={200}
					secureTextEntry
					placeholder='New Password'
					value={input}
					onChangeText={setInputText}
				/>
			</TransparentView>
			<TransparentView
				className='px-10 w-full flex-row justify-center items-center'
				style={{
					gap: 12,
				}}>
				<BottomSheetTextInput
					style={{
						width: '60%',
						marginTop: 8,
						marginBottom: 10,
						borderRadius: 10,
						fontSize: 16,
						lineHeight: 20,
						padding: 8,
						backgroundColor: secondBgColor,
					}}
					editable
					value={code}
					onChangeText={setCode}
					placeholder='Verify Code'
				/>
				<BaseBlurButton
					containerStyle={{
						flex: 1,
					}}
					onPress={fetchEmailCode}>
					Send
				</BaseBlurButton>
			</TransparentView>
			<TransparentView className='w-full items-center mb-4'>
				<BaseBlurButton
					containerStyle={{
						width: '80%',
					}}
					onPress={onSavePress}>
					<Text>Save</Text>
				</BaseBlurButton>
			</TransparentView>
		</>
	);
};

export type ExtendPlayList = PlayList & { checked: boolean };

export const AddCollectionDialog = (props: {
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
			<BackgroundView className='p-4'>
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
			</BackgroundView>
		</Dialog>
	);
};

export const CreateCollectionDialog = (props: {
	visibleState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
	const [isVisible, setVisibleState] = props.visibleState;
	const [newName, setNewName] = useState<string>('');
	const onBackdropPress = () => {
		setVisibleState(!isVisible);
	};
	const dispatch = useDispatch();

	const onSavePress = () => {
		if (newName.length > 50 || newName.length <= 0) {
			handleShowToast(dispatch, 'The newName is invalid');
			return;
		}
		buildPlayList(newName).then(response => {
			const { code } = response;
			if (code === 200) {
				handleShowToast(dispatch, 'Create a collection successfully');
				onBackdropPress();
			} else {
				handleShowToast(dispatch, 'Create a collection unsuccessfully');
			}
		});
	};

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
			<BackgroundView className='p-4'>
				<Dialog.Title
					title='Create a collection'
					titleStyle={{
						color: secondaryColor,
					}}
				/>
				<BlurView
					intensity={80}
					className='rounded-2xl overflow-hidden'>
					<TextInput
						placeholder='Please input collection name'
						className='p-2'
						value={newName}
						onChangeText={setNewName}
					/>
				</BlurView>
				<BaseBlurButton
					containerStyle={{
						width: '60%',
						alignSelf: 'center',
						marginTop: 10,
					}}
					onPress={onSavePress}>
					<Text className='font-semibold'>Save</Text>
				</BaseBlurButton>
			</BackgroundView>
		</Dialog>
	);
};

export const DeleteCollectionDialog = (props: {
	playList: PlayList;
	visibleState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
	const { playList } = props;

	const [isVisible, setVisibleState] = props.visibleState;
	const onBackdropPress = () => {
		setVisibleState(!isVisible);
	};
	const dispatch = useDispatch();

	const onDeleteConfirmPress = () => {
		deletePlayList(playList.id).then(response => {
			const { code } = response;
			if (code === 200) {
				handleShowToast(dispatch, 'Delete this collection successfully');
				onBackdropPress();
			} else {
				handleShowToast(dispatch, 'Delete this collection unsuccessfully');
			}
		});
	};

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
			<BackgroundView className='p-4'>
				<Dialog.Title
					title='Delete this collection'
					titleStyle={{
						color: secondaryColor,
					}}
				/>
				<Text className='text-lg'>
					Are you sure you want to delete this collection?
				</Text>
				<BaseBlurButton
					containerStyle={{
						width: '60%',
						alignSelf: 'center',
						marginTop: 10,
					}}
					onPress={onDeleteConfirmPress}>
					<Text className='font-semibold'>Yes</Text>
				</BaseBlurButton>
			</BackgroundView>
		</Dialog>
	);
};

export const UpdateCollectionDialog = (props: {
	playList: PlayList;
	visibleState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
	const { playList } = props;
	const [isVisible, setVisibleState] = props.visibleState;
	const [newName, setNewName] = useState<string>('');
	const onBackdropPress = () => {
		setVisibleState(!isVisible);
	};
	const dispatch = useDispatch();

	const onSavePress = () => {
		if (newName.length > 50 || newName.length <= 0) {
			handleShowToast(dispatch, 'The newName is invalid');
			return;
		}
		updatePlayList(playList.id, newName).then(response => {
			const { code } = response;
			if (code === 200) {
				handleShowToast(dispatch, 'Update a collection successfully');
				onBackdropPress();
			} else {
				handleShowToast(dispatch, 'Update a collection unsuccessfully');
			}
		});
	};

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
			<BackgroundView className='p-4'>
				<Dialog.Title
					title='Update a collection'
					titleStyle={{
						color: secondaryColor,
					}}
				/>
				<BlurView
					intensity={80}
					className='rounded-2xl overflow-hidden'>
					<TextInput
						placeholder='Please input collection name'
						className='p-2'
						value={newName}
						onChangeText={setNewName}
					/>
				</BlurView>
				<BaseBlurButton
					containerStyle={{
						width: '60%',
						alignSelf: 'center',
						marginTop: 10,
					}}
					onPress={onSavePress}>
					<Text className='font-semibold'>Save</Text>
				</BaseBlurButton>
			</BackgroundView>
		</Dialog>
	);
};

export const DeleteVideoInCollectionDialog = (props: {
	playListId: string;
	videoId: string;
	visibleState: [boolean, Dispatch<SetStateAction<boolean>>];
	filter?: (videoId: string) => any;
}) => {
	const { playListId, videoId, filter } = props;

	const [isVisible, setVisibleState] = props.visibleState;
	const onBackdropPress = () => {
		setVisibleState(!isVisible);
	};
	const dispatch = useDispatch();

	const onDeleteConfirmPress = async () => {
		await deleteFromPlayList(playListId, videoId).then(response => {
			const { code } = response;
			if (code === 200) {
				handleShowToast(dispatch, 'Delete successfully');
				filter && filter(videoId);
				onBackdropPress();
			} else {
				handleShowToast(dispatch, 'Delete unsuccessfully');
			}
		});
	};

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
			<BackgroundView className='p-4'>
				<Dialog.Title
					title='Delete this collection'
					titleStyle={{
						color: secondaryColor,
					}}
				/>
				<Text className='text-lg'>
					Are you sure you want to delete this video in collection?
				</Text>
				<BaseBlurButton
					containerStyle={{
						width: '60%',
						alignSelf: 'center',
						marginTop: 10,
					}}
					onPress={onDeleteConfirmPress}>
					<Text className='font-semibold'>Yes</Text>
				</BaseBlurButton>
			</BackgroundView>
		</Dialog>
	);
};
