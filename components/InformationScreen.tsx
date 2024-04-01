import { BlurView } from 'expo-blur';
import { TransparentView, FeatherIcon, Text } from './Themed';
import { ReactNode, useRef, useState } from 'react';
import { Avatar, Button } from '@rneui/base';
import { ScrollView } from 'moti';
import { dateFormat } from '@/utils/common/calculateUtil';
import {
  ChangeBirthdayBottomSheet,
  ChangeGenderBottomSheet,
  ChangeIntroductionBottomSheet,
  ChangeProfileBottomSheet,
  ExtendBottomSheet,
  NewNameBottomSheet,
} from './ExtendModal';
import BottomSheet from '@gorhom/bottom-sheet';
import { Pressable } from 'react-native';
import { AllUserInfo } from '@/.expo/types/auth';
import { PATH_CONSTANTS } from '@/.expo/types/constant';

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
      title: <Text className='text-lg'>Introduction</Text>,
      iconWithComponent: (
        <Text
          className='text-lg text-gray-400 max-w-[200]'
          numberOfLines={1}>
          {userInfo?.introduction}
        </Text>
      ),
      onPress: () => {
        modalRef.current?.expand();
      },
      extendComponent: (
        <ChangeIntroductionBottomSheet
          introduction={userInfo?.introduction || ''}
        />
      ),
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
