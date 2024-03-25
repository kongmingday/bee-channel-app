import { secondaryColor } from '@/constants/Colors';
import { TransparentView, Text } from './Themed';
import * as Progress from 'react-native-progress';
import { ComponentType, ReactElement, ReactNode } from 'react';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlatList } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';

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

export const A = (props: {}, a: boolean) => {
  return <></>;
};

export type BottomSheetListType = Parameters<typeof BottomSheetFlatList>;
export type FlatListType = Parameters<typeof FlatList>;

export const SimpleFlatList = <P extends {}, T, G>(
  WrapComponent: ComponentType<P>,
) => {
  return (props: P, fetchFunction: G) => {
    return (
      <WrapComponent
        {...props}
        // keyExtractor={(item: T, index: number) => {
        //   return index + item.id;
        // }}
        // ListEmptyComponent={
        //   isNoMore ? (
        //     <NoMoreDataComponent />
        //   ) : (
        //     <TransparentView className='p-1' />
        //   )
        // }
        // ListFooterComponent={
        //   isNoMore ? (
        //     <NoMoreDataComponent />
        //   ) : isLoading ? (
        //     <LoadingComponent />
        //   ) : (
        //     <TransparentView className='p-1' />
        //   )
        // }
      />
    );
  };
};
