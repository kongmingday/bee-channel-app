import { BlurView } from 'expo-blur'
import { MotiView } from 'moti'
import { Text } from './Themed'
import { useAppSelector } from '@/store/hook'

export const Toast = (props: { message?: string }) => {
  const toastShowState = useAppSelector((state) => state.app.toastShowState)
  const toastMessage = useAppSelector((state) => state.app.toastMessage)

  return (
    <MotiView
      className='absolute z-50 w-full items-center -top-20'
      animate={{
        translateY: toastShowState ? 100 : -30
      }}
    >
      <BlurView
        intensity={200}
        className='px-5 py-3 rounded-lg overflow-hidden w-4/5'
      >
        <Text className='text-xl'>{toastMessage}</Text>
      </BlurView>
    </MotiView>
  )
}
