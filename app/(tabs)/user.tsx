import { Image } from 'expo-image';
import {
  Text,
  View,
  BaseBlurButton,
  TransparentView,
  FeatherIcon,
} from '@/components/Themed';
import { Link, router, useFocusEffect } from 'expo-router';
import { SelectionArea, UserTabActionArea } from '@/components/UserScreen';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { LinearGradient } from 'expo-linear-gradient';
import { getAuthToken } from '@/utils/common/tokenUtils';
import { useCallback, useState } from 'react';
import { getUserInfo } from '@/api/user';
import { UserInfo } from '@/.expo/types/auth';
import { PATH_CONSTANTS } from '@/.expo/types/constant';
import { useWindowDimensions } from 'react-native';

const UserInfoScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const data = await getUserInfo();
        setUserInfo(data.result);
      };
      fetchUserData();
    }, []),
  );

  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1 pt-2 px-4'
      style={{
        paddingBottom: tabBarHeight,
      }}>
      <TransparentView
        className='px-2 pt-4 pb-6 flex-row items-center'
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
        <Link
          href={`/(tabs)`}
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
    </LinearGradient>
  );
};

const UserLoginScreen = () => {
  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1 justify-center items-center'
      style={{ gap: 50 }}>
      <Image
        className='w-20 h-20 rounded-lg'
        source={require('@/assets/images/logo.png')}
      />
      <View
        className='w-full items-center'
        style={{ backgroundColor: 'transparent' }}>
        <Text className='text-xl -translate-x-20'>🎉 Have a good time!</Text>
        <Text className='text-xl translate-x-20'>Click here for log in!</Text>
      </View>
      <BaseBlurButton
        title='GO!'
        containerStyle={{
          width: '50%',
        }}
        onPress={() => {
          router.push('/login-modal');
        }}
      />
    </LinearGradient>
  );
};

export default function UserScreen() {
  const { width, height } = useWindowDimensions();
  const [authToken, setAuthToken] = useState('1');

  useFocusEffect(() => {
    const authToken = async () => {
      const authToken = await getAuthToken();
      setAuthToken(authToken);
    };
    authToken();
  });

  return (
    <TransparentView
      style={{
        width,
        height: height,
      }}>
      {authToken ? <UserInfoScreen /> : <UserLoginScreen />}
    </TransparentView>
  );
}
