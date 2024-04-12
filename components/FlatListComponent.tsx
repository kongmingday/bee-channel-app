import { secondaryColor } from '@/constants/Colors';
import { TransparentView, Text } from './Themed';
import { Image } from 'expo-image';
import * as Progress from 'react-native-progress';

export const EmptyDataComponent = () => {
	return (
		<TransparentView className='flex-1 justify-center items-center '>
			<Image
				className='w-20 h-20 rounded-lg'
				source={require('@/assets/images/empty_data_light.png')}
			/>
			<Text className='text-2xl'>No data</Text>
			<Text className=''>No data, Please try again later</Text>
		</TransparentView>
	);
};

export const NoMoreDataComponent = () => {
	return (
		<TransparentView className='items-center py-2'>
			<Text className='text-base'>😔 No More Data</Text>
		</TransparentView>
	);
};

export const LoadingComponent = () => {
	return (
		<TransparentView
			className='flex-row justify-center items-center py-2'
			style={{
				columnGap: 10,
			}}>
			<Text className='text-base'>😤 Loading</Text>
			<Progress.Circle
				className='pt-1'
				indeterminate
				size={13}
				color={secondaryColor}
			/>
		</TransparentView>
	);
};
