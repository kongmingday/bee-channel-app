import { secondaryColor } from '@/constants/Colors';
import { TransparentView, Text } from './Themed';
import * as Progress from 'react-native-progress';
import { ComponentType, ReactElement, ReactNode } from 'react';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlatList } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { FetchDataPageReturn } from '@/store/hook';

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
