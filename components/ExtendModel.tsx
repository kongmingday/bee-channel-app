import {
  ForwardedRef,
  ReactNode,
  forwardRef,
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
import { secondaryColor } from '.././constants/Colors';
import { useAppDispatch } from '@/store/hook';
import { changeParentId, changeUserToId } from '@/store/slices/chatSlice';

export const ExtendModal = forwardRef(
  (props: { children: ReactNode }, ref: ForwardedRef<BottomSheetModal>) => {
    const { children } = props;
    const modalRef = useRef<BottomSheetModal>(null);
    const [bottomIndex, setBottomIndex] = useState(0);
    const snapPoints = useMemo(() => [600], []);
    const dispatch = useAppDispatch();

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
          handleIndicatorStyle={{
            backgroundColor: secondaryColor,
          }}
          snapPoints={snapPoints}
          onDismiss={() => {
            dispatch(changeParentId('0'));
            dispatch(changeUserToId('0'));
          }}>
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
