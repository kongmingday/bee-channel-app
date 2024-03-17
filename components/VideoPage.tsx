import { FlashList } from '@shopify/flash-list';
import {
  BaseBlurButton,
  BaseButton,
  FeatherIcon,
  MaterialIcon,
  Text,
  TransparentView,
} from './Themed';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AnimatePresence, MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import { Avatar } from '@rneui/themed';
import { BlurView } from 'expo-blur';
import { secondBgColor } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { SimpleVideoList } from './VideoAssembly';
import { Comment, SimpleMedia } from '@/.expo/types/media';
import { PATH_CONSTANTS } from '@/.expo/types/constant';
import { calculateDuration, convertNumber } from '@/utils/common/calculateUtil';
import { useFetchDataPage } from '@/store/hook';
import { getCommentPage } from '@/api/media';

export const VideoPageDetail = (props: { videoInfo?: SimpleMedia }) => {
  const [isOpen, setOpenState] = useState(false);
  const { videoInfo } = props;

  return (
    <TransparentView
      className='px-6 pt-3 flex-1'
      style={{
        rowGap: 10,
      }}>
      <TransparentView className='flex-row w-full justify-between items-center'>
        <TransparentView
          className='flex-row items-center'
          style={{
            columnGap: 10,
          }}>
          <Avatar
            source={{
              uri: `${PATH_CONSTANTS}${videoInfo?.author.profile}`,
            }}
            rounded
            size={42}
          />
          <Text
            className='text-base'
            numberOfLines={1}
            style={{
              maxWidth: '50%',
            }}>
            {`${videoInfo?.author.username}`}
          </Text>
          <Text>
            {convertNumber(videoInfo?.author.subscribeCount?.toString())}
          </Text>
        </TransparentView>
        <BaseBlurButton
          containerStyle={{
            width: 120,
          }}
          title={`${
            videoInfo?.author.hasConcern ? 'Unsubscribe' : 'Subscribe'
          }`}
          onPress={() => {}}
        />
      </TransparentView>
      <TransparentView className='px-2'>
        <TransparentView className='flex-row justify-between items-center'>
          <TransparentView>
            <Text className='text-xl'>{videoInfo?.title}</Text>
            <Text>
              {`${convertNumber(videoInfo?.clickedCount)}`} ·{' '}
              {`${calculateDuration(videoInfo?.publicTime)}`}
            </Text>
          </TransparentView>
          <Pressable
            onPress={() => {
              setOpenState(!isOpen);
            }}>
            <FeatherIcon name={`${isOpen ? 'chevron-down' : 'chevron-up'}`} />
          </Pressable>
        </TransparentView>
        <AnimatePresence>
          {isOpen && (
            <MotiView
              className='mt-2'
              from={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}>
              <Text>{videoInfo?.introduction}</Text>
            </MotiView>
          )}
        </AnimatePresence>
      </TransparentView>
      <TransparentView
        className='flex-row w-full'
        style={{
          shadowColor: 'black',
        }}>
        <BaseButton
          containerStyle={{
            backgroundColor: 'transparent',
          }}
          onPress={() => {}}>
          <MaterialIcon name='thumb-up-off-alt' />
        </BaseButton>
        <BaseButton
          containerStyle={{
            backgroundColor: 'transparent',
          }}
          onPress={() => {}}>
          <MaterialIcon name='thumb-down-off-alt' />
        </BaseButton>
        <BaseButton
          containerStyle={{
            backgroundColor: 'transparent',
          }}
          onPress={() => {}}>
          <MaterialIcon name='star-border' />
        </BaseButton>
      </TransparentView>
      <SimpleVideoList />
    </TransparentView>
  );
};

export const CommentRenderItem = ({
  item,
  index,
}: {
  item: any;
  index: number;
}) => {
  const [isOpen, setOpenState] = useState(false);

  return (
    <BlurView
      className='px-4 py-4 rounded-xl overflow-hidden'
      style={{
        rowGap: 10,
      }}>
      <TransparentView
        className='flex-row'
        style={{
          columnGap: 10,
        }}>
        <Avatar
          size={40}
          rounded
          source={{
            uri: `http://192.168.25.128:9000/bee-channel/image/1.png`,
          }}
        />
        <TransparentView>
          <Text>Name</Text>
          <Text>Time</Text>
        </TransparentView>
      </TransparentView>
      <TransparentView
        className='ml-12'
        style={{
          rowGap: 10,
        }}>
        <TransparentView>
          <Pressable
            onPress={() => {
              setOpenState(!isOpen);
            }}>
            <AnimatePresence exitBeforeEnter>
              {isOpen && (
                <MotiView
                  key={1}
                  from={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}>
                  <Text>
                    Somethiesssssssssssssssssssssssssssssssssssssssssssss,
                    Somethiesssssssssssssssssssssssssssssssssssssssssssss
                    Somethiesssssssssssssssssssssssssssssssssssssssssssss
                  </Text>
                </MotiView>
              )}
              {!isOpen && (
                <MotiView
                  key={2}
                  from={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}>
                  <Text numberOfLines={2}>
                    Somethiesssssssssssssssssssssssssssssssssssssssssssss,
                    Somethiesssssssssssssssssssssssssssssssssssssssssssss
                    Somethiesssssssssssssssssssssssssssssssssssssssssssss
                  </Text>
                </MotiView>
              )}
            </AnimatePresence>
          </Pressable>
        </TransparentView>
        <TransparentView
          className='flex-row w-full items-center'
          style={{
            columnGap: 15,
          }}>
          <MaterialIcon
            name='thumb-up-off-alt'
            size={20}
          />
          <MaterialIcon
            name='thumb-down-off-alt'
            size={20}
          />
          <MaterialIcon
            name='chat-bubble-outline'
            size={20}
          />
        </TransparentView>
        <BlurView
          intensity={70}
          className='px-4 py-2 overflow-hidden'
          style={{
            rowGap: 10,
          }}>
          <Text numberOfLines={2}>Name: Value</Text>
          <Text numberOfLines={2}>Name: Value</Text>
          <TransparentView className='flex-row items-center'>
            <Text>More replies</Text>
            <MaterialIcon
              name='chevron-right'
              size={20}
            />
          </TransparentView>
        </BlurView>
      </TransparentView>
    </BlurView>
  );
};

export const VideoPageComment = (props: { videoId: string }) => {
  const { data, isRefreshing, fetchData, refreshPage } = useFetchDataPage<
    Comment,
    any,
    any
  >(getCommentPage);

  return (
    <TransparentView
      className='flex-1 p-4'
      style={{
        rowGap: 10,
      }}>
      <Pressable
        className='flex-row items-center'
        style={{
          columnGap: 5,
        }}>
        <Feather
          name='menu'
          size={20}
        />
        <Text className='text-base'>Newest</Text>
      </Pressable>
      <FlashList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={data}
        extraData={data}
        estimatedItemSize={175}
        keyExtractor={(item: Comment) => {
          return item.id;
        }}
        ListEmptyComponent={
          <TransparentView className='items-center'>
            <Text className='text-base'>😔 No More Data</Text>
          </TransparentView>
        }
        renderItem={({ item, index }) => {
          return (
            <CommentRenderItem
              item={item}
              index={index}
            />
          );
        }}
        ItemSeparatorComponent={() => {
          return <TransparentView className='h-4' />;
        }}
      />
      <TextInput
        className='w-full px-4 py-2 rounded-full'
        placeholder='Aha'
        style={{
          backgroundColor: secondBgColor,
        }}
      />
    </TransparentView>
  );
};
