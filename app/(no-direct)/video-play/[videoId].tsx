import { TransparentView, PressableIcon } from '@/components/Themed';
import * as ScreenOrientation from 'expo-screen-orientation';
import { LinearGradient } from 'expo-linear-gradient';
import VideoPlayer from 'expo-video-player';
import { ResizeMode } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { setStatusBarHidden } from 'expo-status-bar';
import { Video } from 'expo-av';
import { Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Tab, TabView } from '@rneui/themed';
import { VideoPageComment, VideoPageDetail } from '@/components/VideoPage';
import { secondaryColor, ignoreTextColor } from '@/constants/Colors';
import { PATH_CONSTANTS } from '@/.expo/types/constant';
import { getVideoInfo } from '@/api/media';
import { SimpleMedia } from '@/.expo/types/media';
import { ExtendModal } from '@/components/ExtendModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useDispatch } from 'react-redux';
import { changeParentId, changeUserToId } from '@/store/slices/chatSlice';

export default function VideoPlayScreen() {
  const { videoId } = useLocalSearchParams();

  const [inFullscreen, setInFullscreen] = useState(false);
  const [index, setIndex] = useState(0);
  const videoRef = useRef<Video>(new Video({}));
  const [videoInfo, setVideoInfo] = useState<SimpleMedia>();
  const modalRef = useRef<BottomSheetModal>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideoInfo = async () => {
      const { result } = await getVideoInfo(videoId as string);
      setVideoInfo(result);
    };
    fetchVideoInfo();
  }, []);

  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1 '>
      <VideoPlayer
        videoProps={{
          shouldPlay: false,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: `${PATH_CONSTANTS}${videoInfo?.savePath}`,
          },
          ref: videoRef,
        }}
        header={
          <TransparentView
            className='w-full'
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <PressableIcon
              name='chevron-left'
              size={40}
              color={`#FFFFFF`}
              onPress={(event) => {
                router.back();
              }}
            />
          </TransparentView>
        }
        fullscreen={{
          inFullscreen: inFullscreen,
          enterFullscreen: async () => {
            setStatusBarHidden(true, 'fade');
            setInFullscreen(!inFullscreen);
            await ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.LANDSCAPE_LEFT,
            );
            videoRef.current.setStatusAsync({
              shouldPlay: true,
            });
          },
          exitFullscreen: async () => {
            setStatusBarHidden(false, 'fade');
            setInFullscreen(!inFullscreen);
            await ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.PORTRAIT_UP,
            );
          },
        }}
        style={{
          controlsBackgroundColor: 'transparent',
          videoBackgroundColor: 'black',
          height: inFullscreen ? Dimensions.get('window').width : 255,
          width: inFullscreen
            ? Dimensions.get('window').height
            : Dimensions.get('window').width,
        }}
      />
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={{
          backgroundColor: secondaryColor,
          height: 3,
          width: '15%',
          left: '17.5%',
        }}
        titleStyle={(active) => ({
          fontSize: 20,
          color: active ? secondaryColor : ignoreTextColor,
        })}
        buttonStyle={{
          padding: 5,
        }}>
        <Tab.Item title={`Detail`} />
        <Tab.Item title={`Comment`} />
      </Tab>
      <TabView
        value={index}
        onChange={setIndex}
        animationType='spring'
        containerStyle={{
          flex: 1,
        }}>
        <TabView.Item className='flex-1'>
          <VideoPageDetail
            videoInfo={videoInfo}
            setVideoInfo={setVideoInfo}
          />
        </TabView.Item>
        <TabView.Item className='flex-1'>
          <VideoPageComment modalRef={modalRef} />
        </TabView.Item>
      </TabView>
      <ExtendModal
        ref={modalRef}
        onDismiss={() => {
          dispatch(changeParentId('0'));
          dispatch(changeUserToId('0'));
        }}>
        <VideoPageComment isChildren />
      </ExtendModal>
    </LinearGradient>
  );
}
