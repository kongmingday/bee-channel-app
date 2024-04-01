import { secondaryColor } from '@/constants/Colors';
import { TransparentView, Text } from './Themed';
import * as Progress from 'react-native-progress';

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
