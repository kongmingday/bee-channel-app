import { FlashList } from '@shopify/flash-list';
import { MaterialIcon, Text, TransparentView, View } from './Themed';
import { Feather } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { MotiView } from 'moti';
import { Image } from 'expo-image';
import { useState, useRef, useEffect } from 'react';
import { FlatList, Pressable } from 'react-native';
import clsx from 'clsx';
import { BlurView } from 'expo-blur';
import { buttonColor } from '@/constants/Colors';
import { PageParams } from '@/.expo/types';
import {
  getHistoryVideoPage,
  getLikedVideoPage,
  getWatchLaterVideoPage,
} from '@/api/media';
import { SimpleMedia, Video } from '@/.expo/types/media';
import { PATH_CONSTANTS } from '@/.expo/types/constant';
import { UserAreaType } from '@/.expo/types/enum';
import {
  FetchDataPageReturn,
  useAppDispatch,
  useFetchDataPage,
} from '@/store/hook';
import { router } from 'expo-router';
import { changeDeriveId } from '@/store/slices/chatSlice';
import { LoadingComponent, NoMoreDataComponent } from './FlatListComponent';

const UserTabRenderItem = (props: { item: SimpleMedia; index: number }) => {
  const { item, index } = props;

  const dispatch = useAppDispatch();

  return (
    <Pressable
      key={item.id}
      className='flex-1'
      onPress={() => {
        dispatch(changeDeriveId(item.id));
        router.push(`/(no-direct)/video-play/${item.id}`);
      }}>
      <BlurView
        className='px-2 py-2 mx-1 overflow-hidden rounded-lg '
        style={{
          rowGap: 10,
        }}>
        <Image
          className='w-full h-[100] rounded-lg'
          source={`${PATH_CONSTANTS}${item.coverPath}`}
        />
        <TransparentView className='mx-1 gap-y-1'>
          <Text
            numberOfLines={2}
            className='mx-1'
            isTitle>
            {item.title}
          </Text>
          <TransparentView className='flex-row items-center gap-x-2'>
            <Feather
              name='user'
              size={18}
            />
            <Text>{item.author.username}</Text>
          </TransparentView>
        </TransparentView>
      </BlurView>
    </Pressable>
  );
};

export const VerticalVideoList = (props: {
  fetchFunc: FetchDataPageReturn<any, any>;
  column?: number;
}) => {
  const { fetchFunc, column } = props;

  return (
    <>
      <FlashList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={fetchFunc.data}
        numColumns={column || 2}
        keyExtractor={(item, index) => {
          return index + '-' + item.id;
        }}
        estimatedItemSize={220}
        refreshing={fetchFunc.isRefreshing}
        onRefresh={() => {
          fetchFunc.refreshPage();
        }}
        onEndReached={() => {
          fetchFunc.fetchData();
        }}
        renderItem={({ item, index }) => {
          return (
            <UserTabRenderItem
              key={item.id}
              item={item}
              index={index}
            />
          );
        }}
        ListHeaderComponent={<TransparentView className='h-2' />}
        ListEmptyComponent={
          fetchFunc.isNoMore && fetchFunc.dataTotal > 0 ? (
            <NoMoreDataComponent />
          ) : (
            <TransparentView className='p-1' />
          )
        }
        ListFooterComponent={
          fetchFunc.isNoMore ? (
            <NoMoreDataComponent />
          ) : fetchFunc.isLoading ? (
            <LoadingComponent />
          ) : (
            <TransparentView className='p-1' />
          )
        }
        ItemSeparatorComponent={() => {
          return <TransparentView className='h-2' />;
        }}
      />
    </>
  );
};

export const SelectionArea = () => {
  const actionArea = [
    {
      name: 'Liked',
      icons: <MaterialIcon name='star-border' />,
      fetchData: getLikedVideoPage,
    },
    {
      name: 'Watch Later',
      icons: <MaterialIcon name='access-time' />,
      fetchData: getWatchLaterVideoPage,
    },
    {
      name: 'History',
      icons: <MaterialIcon name='history' />,
      fetchData: getHistoryVideoPage,
    },
  ];
  const [selectKey, setSelectKey] = useState<number>(0);
  const motiRef = useRef<any>(null);

  const processData = (data: any) => {
    return data.map((item: any) => item.video);
  };

  const { setFetchFunction, setProcessState, ...other } = useFetchDataPage<any>(
    () => {
      actionArea[selectKey].fetchData;
    },
    processData,
  );

  useEffect(() => {
    if (selectKey === 2) {
      setProcessState(true);
    } else {
      setProcessState(false);
    }
    setFetchFunction(() => actionArea[selectKey].fetchData);
  }, [selectKey]);

  return (
    <TransparentView className='flex-1 w-full mt-3'>
      <BlurView
        className='flex-row rounded-full mx-6 py-3 overflow-hidden '
        intensity={80}>
        <MotiView
          ref={motiRef}
          from={{ translateX: 0 }}
          animate={{ translateX: motiRef?.current * selectKey }}
          transition={{ type: 'timing', duration: 200 }}
          onLayout={(event) => {
            motiRef.current = event.nativeEvent.layout.width;
          }}
          className='w-1/3 absolute h-10 rounded-full'
          style={{
            backgroundColor: buttonColor,
          }}
        />
        {actionArea.map((item, index) => (
          <Pressable
            key={item.name}
            className='flex-1 items-center bg-transparent'
            onPress={() => {
              setSelectKey(index);
            }}>
            <Text
              className={clsx('text-xs ', {
                'text-white': selectKey === index,
              })}>
              {item.name}
            </Text>
          </Pressable>
        ))}
      </BlurView>
      <VerticalVideoList
        fetchFunc={{ setFetchFunction, setProcessState, ...other }}
      />
    </TransparentView>
  );
};

export const UserTabActionArea = () => {
  return (
    <TransparentView
      className='flex-row justify-around'
      style={{ gap: 20 }}>
      {[0, 1, 2].map((item) => (
        <BlurView
          key={item}
          className='px-5 items-center rounded-lg overflow-hidden py-1'
          intensity={80}>
          <Text className='text-lg'>14</Text>
          <Text className=' text-lg text-gray-400'>videos</Text>
        </BlurView>
      ))}
    </TransparentView>
  );
};
