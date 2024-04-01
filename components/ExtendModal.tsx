import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
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
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { dateFormat } from '@/utils/common/calculateUtil';
import { uploadUserInfo } from '@/api/user';
import { router } from 'expo-router';
import { UploadUserInfo } from '@/.expo/types/auth';

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
  uploadUserInfo(date).then((response) => {
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
  const [pickerShow, setShowState] = useState<boolean>(false);
  const [birthday, setBirthday] = useState<Date>(new Date(props.birthday));

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // console.log(selectedDate);
    setShowState(false);
    // if (selectedDate) {
    //   setBirthday(selectedDate);
    // }
  };

  return (
    <>
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
            setShowState(true);
          }}>
          <Text>{`${dateFormat(birthday)}`}</Text>
        </BaseBlurButton>
        {pickerShow && (
          <DateTimePicker
            testID='1'
            mode='date'
            value={birthday}
            // onChange={onChange}
            maximumDate={new Date()}
          />
        )}
      </TransparentView>
      <TransparentView className='w-full items-center mb-4'>
        <BaseBlurButton
          containerStyle={{
            width: '80%',
          }}
          onPress={() => {}}>
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
          onPress={() => {}}>
          <Text>Save</Text>
        </BaseBlurButton>
      </TransparentView>
    </>
  );
};
