import { Modal, Pressable } from 'react-native';
import { IonIcon, TransparentView, Text } from './Themed';
import {
  ForwardedRef,
  ReactElement,
  ReactNode,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

export const ExtendModal = forwardRef(
  (props: { children: ReactNode }, ref: ForwardedRef<BottomSheetModal>) => {
    const { children } = props;
    const modalRef = useRef<BottomSheetModal>(null);
    const [bottomIndex, setBottomIndex] = useState(0);
    const snapPoints = useMemo(() => [600], []);

    useImperativeHandle<Partial<BottomSheetModal>, Partial<BottomSheetModal>>(
      ref,
      () => ({
        present: modalRef.current!.present,
        dismiss: modalRef.current!.dismiss,
      }),
    );

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          enableDynamicSizing
          ref={modalRef}
          index={bottomIndex}
          backgroundStyle={{
            backgroundColor: '#e7defa',
          }}
          maxDynamicContentSize={600}
          backgroundComponent={() => {
            return (
              <LinearGradient
                colors={['#e9defa', '#ace0f9']}
                className='h-full w-full bottom-0 absolute'
              />
            );
          }}
          snapPoints={snapPoints}>
          <BottomSheetView
            style={{
              flex: 1,
            }}>
            {children}
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  },
);
