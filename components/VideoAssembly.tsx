import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { TransparentView, Text, BaseBlurButton } from './Themed'
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { Avatar } from '@rneui/themed'
import { ignoreTextColor } from '@/constants/Colors'

export const SimpleVideoRenderItem = ({
  item,
  index
}: {
  item: any
  index: number
}) => {
  return (
    <BlurView
      intensity={80}
      className='p-4 overflow-hidden flex-row rounded-2xl'
      style={{
        columnGap: 12
      }}
    >
      <Image
        className='w-[40%] h-[100]  rounded-lg'
        source={`http://192.168.25.128:9000/bee-channel/image/1.png`}
      />
      <TransparentView className='justify-between'>
        <Text
          className='text-base'
          numberOfLines={2}
        >
          Title
        </Text>
        <TransparentView className='gap-y-2'>
          <TransparentView className='flex-row items-center gap-x-2'>
            <Feather
              name='user'
              className='mr-2'
              size={18}
            />
            <Text>username</Text>
          </TransparentView>
          <TransparentView className='flex-row items-center gap-x-2'>
            <Feather
              name='play-circle'
              className='mr-2'
              size={18}
            />
            <Text>username</Text>
          </TransparentView>
        </TransparentView>
      </TransparentView>
    </BlurView>
  )
}

export const SimpleAuthorRenderItem = ({
  item,
  index
}: {
  item: any
  index: number
}) => {
  return (
    <BlurView
      className='flex-1 flex-row p-4 rounded-xl overflow-hidden justify-between items-center'
      intensity={80}
    >
      <Avatar
        size={50}
        rounded
        source={{
          uri: `http://192.168.25.128:9000/bee-channel/image/1.png`
        }}
      />
      <TransparentView className='flex-1 mx-4'>
        <Text
          className='mb-1'
          numberOfLines={1}
        >
          Name
        </Text>
        <Text
          className='text-xs'
          numberOfLines={1}
          style={{
            color: ignoreTextColor
          }}
        >
          172 fans
        </Text>
        <Text
          className='text-xs'
          numberOfLines={1}
          style={{
            color: ignoreTextColor
          }}
        >
          the billions user of the bee-channel、the best user of the 2023 year
        </Text>
      </TransparentView>
      <BaseBlurButton
        radius='rounded-xl'
        intensity={150}
        fontSize={13}
        onPress={() => {}}
      >
        Subscribed
      </BaseBlurButton>
    </BlurView>
  )
}

export const SimpleAuthorList = () => {
  const resData = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <TransparentView className='flex-1 px-2'>
      <FlashList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={resData}
        extraData={resData}
        estimatedItemSize={175}
        keyExtractor={(item) => {
          return item.toString()
        }}
        ListHeaderComponent={<TransparentView className='h-2' />}
        ListFooterComponent={<TransparentView className='h-4' />}
        ItemSeparatorComponent={() => {
          return <TransparentView className='h-2' />
        }}
        renderItem={({ item, index }) => {
          return (
            <SimpleAuthorRenderItem
              item={item}
              index={index}
            />
          )
        }}
      />
    </TransparentView>
  )
}

export const SimpleVideoList = () => {
  const resData = [0, 1, 2, 3, 4, 5, 6]
  return (
    <FlashList
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={resData}
      extraData={resData}
      estimatedItemSize={175}
      keyExtractor={(item) => {
        return item.toString()
      }}
      ListHeaderComponent={<TransparentView className='h-2' />}
      ListFooterComponent={<TransparentView className='h-4' />}
      renderItem={SimpleVideoRenderItem}
      ItemSeparatorComponent={() => {
        return <TransparentView className='h-2' />
      }}
    />
  )
}
