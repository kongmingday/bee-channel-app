import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { BaseBlurButton, MaterialIcon, Text, TransparentView } from './Themed';
import { secondaryColor } from '@/constants/Colors';
import { router } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

export const NotTabView = (props: {
	children: ReactNode;
	headerComponent?: ReactNode;
	contentStyle?: string;
	headerStyle?: string;
}) => {
	const { children, headerComponent, contentStyle, headerStyle } = props;

	return (
		<BackgroundView className={`flex-1 px-8 pt-6 ${contentStyle}`}>
			<TransparentView
				className={`flex-row justify-between items-center mb-6 ${headerStyle}`}>
				<Pressable
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
				</Pressable>
				{headerComponent}
			</TransparentView>
			{children}
		</BackgroundView>
	);
};

export const LoginScreen = () => {
	return (
		<BackgroundView
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
		</BackgroundView>
	);
};

export const BackgroundView = (props: {
	children?: ReactNode;
	className?: string | undefined;
	style?: StyleProp<ViewStyle>;
}) => {
	const { children, className, style } = props;

	const [isColorful, setColorState] = useState<boolean>(true);
	return isColorful ? (
		<LinearGradient
			start={[1, 0.4]}
			end={[0, 0.6]}
			colors={['#e9defa', '#ace0f9']}
			className={className}
			style={style}>
			{children}
		</LinearGradient>
	) : (
		<TransparentView
			className={`bg-[#ffffff] ${className}`}
			style={style}>
			{children}
		</TransparentView>
	);
};
