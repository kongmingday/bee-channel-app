import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { BaseBlurButton, MaterialIcon, Text, TransparentView } from './Themed';
import { secondaryColor } from '@/constants/Colors';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Image } from 'expo-image';

export const NotTabView = (props: {
  children: ReactNode;
  headerComponent?: ReactNode;
  contentStyle?: string;
  headerStyle?: string;
}) => {
  const { children, headerComponent, contentStyle, headerStyle } = props;

  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className={`flex-1 px-8 pt-6 ${contentStyle}`}>
      <Pressable
        className={`flex-row justify-between items-center mb-6 ${headerStyle}`}
        onPress={() => {
          if (router.canDismiss()) {
            router.dismiss();
          } else {
            router.replace('/(tabs)/');
          }
        }}>
        <MaterialIcon
          lightColor={secondaryColor}
          name='chevron-left'
          size={30}
        />
        {headerComponent}
      </Pressable>
      {children}
    </LinearGradient>
  );
};

export const LoginScreen = () => {
  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1 justify-center items-center'
      style={{ gap: 50 }}>
      <Image
        className='w-20 h-20 rounded-lg'
        source={require('@/assets/images/logo.png')}
      />
      <TransparentView className='w-full items-center'>
        <Text className='text-xl -translate-x-20'>🎉 Have a good time!</Text>
        <Text className='text-xl translate-x-20'>Click here for log in!</Text>
      </TransparentView>
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
