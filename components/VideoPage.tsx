import { FlashList } from '@shopify/flash-list';
import {
  BaseBlurButton,
  BaseButton,
  FeatherIcon,
  MaterialIcon,
  MaterialIconType,
  Text,
  TransparentView,
} from './Themed';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AnimatePresence, MotiView } from 'moti';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  memo,
  RefObject,
} from 'react';
import { Pressable, TextInput } from 'react-native';
import { Avatar } from '@rneui/themed';
import { BlurView } from 'expo-blur';
import { secondBgColor } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { SimpleVideoList } from './VideoAssembly';
import { Comment, SimpleMedia } from '@/.expo/types/media';
import { PATH_CONSTANTS } from '@/.expo/types/constant';
import { calculateDuration, convertNumber } from '@/utils/common/calculateUtil';
import { useAppDispatch, useAppSelector, useFetchDataPage } from '@/store/hook';
import { commitComment, getCommentPage } from '@/api/media';
import { DeriveType, OrderType } from '@/.expo/types/enum';
import { changeDeriveId } from '@/store/slices/chatSlice';
import { router } from 'expo-router';
import { ExtendModal } from './ExtendModel';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { LoadingComponent, NoMoreDataComponent } from './FlatListComponent';

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
              maxWidth: 200,
            }}>
            {`${videoInfo?.author.username}`}
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

export const CommentRenderItem = memo(
  (props: {
    item: Comment;
    index: number;
    isChildren: boolean;
    openModal?: () => void;
  }) => {
    const { item, isChildren, openModal } = props;
    const [isOpen, setOpenState] = useState(false);

    const buttonAction: {
      name: MaterialIconType;
      onClick: () => void;
    }[] = [
      {
        name: 'thumb-up-off-alt',
        onClick: () => {},
      },
      {
        name: 'thumb-down-off-alt',
        onClick: () => {},
      },
      {
        name: 'chat-bubble-outline',
        onClick: () => {},
      },
    ];

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
              uri: `${PATH_CONSTANTS}${item.fromUser.profile}`,
            }}
          />
          <TransparentView>
            <Text>{item.fromUser.username}</Text>
            <Text>{calculateDuration(item.createTime)}</Text>
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
                    <Text>{item.content}</Text>
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
                    <Text numberOfLines={2}>{item.content}</Text>
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
            {buttonAction.map((item) => (
              <Pressable onPress={item.onClick}>
                <MaterialIcon
                  name={item.name}
                  size={20}
                />
              </Pressable>
            ))}
          </TransparentView>
          {!isChildren && item.childrenCount > 0 && (
            <Pressable onPress={() => {}}>
              <BlurView
                intensity={70}
                className='px-4 py-2 overflow-hidden'
                style={{
                  rowGap: 10,
                }}>
                <Pressable
                  className='flex-row items-center'
                  onPress={() => {
                    openModal && openModal();
                  }}>
                  <Text>More replies</Text>
                  <MaterialIcon
                    name='chevron-right'
                    size={20}
                  />
                </Pressable>
              </BlurView>
            </Pressable>
          )}
        </TransparentView>
      </BlurView>
    );
  },
  () => true,
);

export const VideoPageComment = (props: {
  modalRef?: RefObject<BottomSheetModal>;
  isChildren?: boolean;
}) => {
  const { modalRef, isChildren } = props;
  const deriveId = useAppSelector((state) => state.chat.deriveId);

  const [input, setInput] = useState<string>('');
  // const modalRef = useRef<BottomSheetModal>(null);

  const { data, isRefreshing, isLoading, isNoMore, fetchData, refreshPage } =
    useFetchDataPage<Comment, any, any>(getCommentPage, undefined, undefined, {
      videoId: deriveId,
      orderBy: OrderType.HOT,
    });

  const handleCommit = async () => {
    if (input.length <= 0) {
      return;
    }
    await commitComment({
      deriveId,
      deriveType: DeriveType.VIDEO,
      content: input,
    }).then((res) => {
      if (res.result) {
        refreshPage();
      }
    });
  };

  return (
    <TransparentView
      className='flex-1 p-4'
      style={{
        rowGap: 10,
      }}>
      <Pressable
        className='flex-row items-center '
        style={{
          columnGap: 5,
        }}>
        <Feather
          name='menu'
          size={20}
        />
        <Text className='text-base'>Newest</Text>
      </Pressable>
      {isChildren ? (
        <BottomSheetFlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={data}
          extraData={data}
          onEndReached={fetchData}
          onEndReachedThreshold={0}
          refreshing={isRefreshing}
          onRefresh={refreshPage}
          keyExtractor={(item: Comment, index) => {
            return index + item.id;
          }}
          ListEmptyComponent={
            isNoMore ? (
              <NoMoreDataComponent />
            ) : (
              <TransparentView className='p-1' />
            )
          }
          ListFooterComponent={
            isNoMore ? (
              <NoMoreDataComponent />
            ) : isLoading ? (
              <LoadingComponent />
            ) : (
              <TransparentView className='p-1' />
            )
          }
          renderItem={({ item, index }) => {
            return (
              <CommentRenderItem
                key={index + '-' + item.id}
                isChildren={isChildren || false}
                item={item}
                index={index}
                openModal={() => {
                  modalRef?.current?.present();
                }}
              />
            );
          }}
          ItemSeparatorComponent={() => {
            return <TransparentView className='h-4' />;
          }}
        />
      ) : (
        <FlashList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={data}
          extraData={data}
          estimatedItemSize={175}
          onEndReached={fetchData}
          refreshing={isRefreshing}
          onRefresh={refreshPage}
          keyExtractor={(item: Comment, index) => {
            return index + item.id;
          }}
          ListEmptyComponent={
            <TransparentView className='items-center'>
              <Text className='text-base'>😔 No More Data</Text>
            </TransparentView>
          }
          renderItem={({ item, index }) => {
            return (
              <CommentRenderItem
                key={index + '-' + item.id}
                isChildren={isChildren || false}
                item={item}
                index={index}
                openModal={() => {
                  modalRef?.current?.present();
                }}
              />
            );
          }}
          ItemSeparatorComponent={() => {
            return <TransparentView className='h-4' />;
          }}
        />
      )}
      <TransparentView
        className='w-full flex-row items-center'
        style={{
          columnGap: 10,
        }}>
        <TextInput
          className='flex-1 px-4 py-2 rounded-full'
          placeholder='Aha'
          style={{
            backgroundColor: secondBgColor,
          }}
          value={input}
          onChangeText={setInput}
        />
        <BaseBlurButton
          containerStyle={{
            width: 80,
          }}
          title='Commit'
          onPress={() => {
            handleCommit();
          }}
        />
      </TransparentView>

      {/* {!isChildren && (
        <ExtendModal ref={modalRef}>
          <VideoPageComment isChildren />
        </ExtendModal>
      )} */}
    </TransparentView>
  );
};
