import { FlashList } from '@shopify/flash-list';
import { Text, TransparentView, View } from './Themed';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import { Avatar } from '@rneui/themed';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { getSubscriptionVideoList } from '@/api/media';
import { useAppDispatch, useFetchDataPage } from '@/store/hook';
import { Video } from '@/.expo/types/media';
import { PATH_CONSTANTS } from '@/.expo/types/constant';
import { calculateDuration, convertNumber } from '@/utils/common/calculateUtil';
import { getSubscription } from '@/api/user';
import { UserInfo } from '@/.expo/types/auth';
import { FlatList } from 'react-native';
import { changeDeriveId } from '@/store/slices/chatSlice';

export const SubscriptionAuthorList = () => {
  const { data, isRefreshing, fetchData, refreshPage } =
    useFetchDataPage<UserInfo>(getSubscription, undefined, 6);

  return (
    <BlurView
      className='flex-row w-full rounded-3xl overflow-hidden'
      intensity={80}>
      <TransparentView
        className='flex-initial py-3'
        style={{
          rowGap: 10,
        }}>
        <Text className='text-lg px-5'>Author</Text>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 18,
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={data}
          extraData={data}
          horizontal
          refreshing={isRefreshing}
          onRefresh={() => {
            refreshPage();
          }}
          onEndReached={() => {
            fetchData();
          }}
          keyExtractor={(item: UserInfo) => {
            return item.id;
          }}
          renderItem={({ item }) => {
            return (
              <TransparentView
                key={item.id}
                className='items-center'>
                <Avatar
                  size={55}
                  rounded
                  source={{
                    uri: `${PATH_CONSTANTS}${item.profile}`,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{ width: 64 }}>
                  {item.username}
                </Text>
              </TransparentView>
            );
          }}
          ItemSeparatorComponent={() => {
            return <TransparentView className='w-4' />;
          }}
        />
      </TransparentView>
      <TransparentView className='grow' />
    </BlurView>
  );
};

export const SubscriptionTabRenderItem = (props: {
  item: Video;
  index: number;
}) => {
  const { item } = props;
  const dispatch = useAppDispatch();

  return (
    <Pressable
      key={item.id}
      onPress={() => {
        dispatch(changeDeriveId(item.id));
        router.push(`/(no-direct)/video-play/${item.id}`);
      }}
      className='mb-2'>
      <BlurView
        className='p-4 rounded-3xl overflow-hidden'
        style={{ rowGap: 20 }}
        intensity={80}>
        <Image
          className='w-full h-[200] rounded-3xl'
          source={`${PATH_CONSTANTS}${item.coverPath}`}
        />
        <TransparentView
          className='flex-row items-center w-full'
          style={{
            columnGap: 10,
          }}>
          <Avatar
            size={50}
            rounded
            source={{
              uri: `${PATH_CONSTANTS}${item.author.profile}`,
            }}
          />
          <TransparentView className='flex-1'>
            <Text
              numberOfLines={1}
              className='text-lg'>
              {item.title}
            </Text>
            <Text numberOfLines={1}>
              {`${item.author.username} ·  `}
              {`${convertNumber(item.clickedCount)} views  ·  `}
              {`${calculateDuration(item.publicTime)}`}
            </Text>
          </TransparentView>
        </TransparentView>
      </BlurView>
    </Pressable>
  );
};

export const SubscriptionVideoList = () => {
  const { data, isRefreshing, fetchData, refreshPage } =
    useFetchDataPage<Video>(getSubscriptionVideoList);

  return (
    <TransparentView className='w-full flex-1'>
      <FlashList
        showsVerticalScrollIndicator={false}
        data={data}
        estimatedItemSize={175}
        keyExtractor={(item, index) => {
          return item.id + index;
        }}
        refreshing={isRefreshing}
        onRefresh={() => {
          refreshPage();
        }}
        onEndReached={() => {
          fetchData();
        }}
        ListHeaderComponent={<TransparentView className='h-2' />}
        ListFooterComponent={<TransparentView className='h-4' />}
        renderItem={({ item, index }) => {
          return (
            <SubscriptionTabRenderItem
              item={item}
              index={index}
            />
          );
        }}
      />
    </TransparentView>
  );
};
