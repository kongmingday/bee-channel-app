import { BlurView } from 'expo-blur'
import { Pressable, useWindowDimensions } from 'react-native'
import { router } from 'expo-router'
import { AntDesignIcon, BaseBlurButton, Text, TransparentView } from './Themed'
import { SearchBar, Tab, TabView } from '@rneui/themed'
import { useState } from 'react'
import { ignoreTextColor, secondaryColor } from '@/constants/Colors'
import { MotiView } from 'moti'
import { SimpleAuthorList, SimpleVideoList } from './VideoAssembly'

const searchBarHeight = 60
const tabHeight = 50
const sortHeight = 50
const ignoreHeight = searchBarHeight + tabHeight + sortHeight

export const SearchHeader = () => {
  return (
    <BlurView
      className='px-4 flex-row items-center'
      intensity={100}
      style={{
        columnGap: 10,
        height: searchBarHeight
      }}
    >
      <Pressable
        onPress={() => {
          router.push('/(tabs)/')
        }}
      >
        <AntDesignIcon name='arrowleft' />
      </Pressable>
      <SearchBar
        lightTheme
        containerStyle={{
          backgroundColor: 'transparent',
          flex: 1,
          borderColor: 'transparent'
        }}
        inputContainerStyle={{
          borderRadius: 50,
          backgroundColor: '#fff',
          height: 40
        }}
      />
      <BaseBlurButton
        radius='rounded-xl'
        intensity={150}
        onPress={() => {}}
      >
        Search
      </BaseBlurButton>
    </BlurView>
  )
}

export const SearchVideoTab = () => {
  const sortMap = ['Most', 'Newest']
  const [isOpen, setOpenState] = useState(false)
  const [sortIndex, setSortIndex] = useState(0)
  const [categoryIndex, setCategoryIndex] = useState(0)
  const tabViewHeight = useWindowDimensions().height - ignoreHeight

  const resData = [
    {
      index: 0,
      name: 'Music'
    },
    {
      index: 1,
      name: 'Movies'
    },
    {
      index: 2,
      name: 'Tech'
    },
    {
      index: 3,
      name: 'Gaming'
    },
    {
      index: 4,
      name: 'Life'
    },
    {
      index: 5,
      name: 'Learning'
    },
    {
      index: 6,
      name: 'News'
    },
    {
      index: 7,
      name: 'Dancing'
    }
  ]

  return (
    <TransparentView className='flex-1'>
      <BlurView
        className='flex-row w-full pl-7 pr-3 py-3 justify-between'
        style={{
          height: sortHeight
        }}
      >
        <TransparentView
          className='flex-row'
          style={{
            columnGap: 25
          }}
        >
          {sortMap.map((item, index) => (
            <Pressable
              key={item}
              onPress={() => {
                setSortIndex(index)
              }}
            >
              <Text
                className='text-base'
                style={{
                  color: index === sortIndex ? secondaryColor : ignoreTextColor
                }}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </TransparentView>
        <Pressable
          onPress={() => {
            setOpenState(!isOpen)
          }}
        >
          <TransparentView
            className='flex-row'
            style={{
              columnGap: 4
            }}
          >
            <Text className='text-base'>Filter</Text>
            <AntDesignIcon
              name='filter'
              color={secondaryColor}
            />
          </TransparentView>
        </Pressable>
      </BlurView>

      <MotiView
        className='absolute w-full z-50'
        animate={{
          height: isOpen ? tabViewHeight : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{
          type: 'timing'
        }}
        style={{
          marginTop: sortHeight,
          height: tabViewHeight
        }}
      >
        <TransparentView
          className='py-2 bg-[#e6e5fb]'
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <Text className='pl-7 text-base'>Category</Text>
          <TransparentView className='flex-row flex-wrap justify-center '>
            {resData.map((item, index) => (
              <Pressable
                onPress={() => {
                  setCategoryIndex(index)
                }}
                className='p-2 w-20 items-center rounded-xl mx-3 my-2'
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }}
              >
                <Text
                  style={{
                    color:
                      index === categoryIndex ? secondaryColor : ignoreTextColor
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </TransparentView>
        </TransparentView>
        <TransparentView
          className='flex-1'
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
        ></TransparentView>
      </MotiView>
      <TransparentView className='flex-1 px-2'>
        <SimpleVideoList />
      </TransparentView>
    </TransparentView>
  )
}

export const SearchUserTab = () => {
  const sortMap = ['Most', 'Newest']
  const [sortIndex, setSortIndex] = useState(0)
  return (
    <TransparentView className='flex-1'>
      <BlurView
        className='flex-row w-full pl-7 pr-3 py-3 justify-between'
        style={{
          height: sortHeight
        }}
      >
        <TransparentView
          className='flex-row'
          style={{
            columnGap: 25
          }}
        >
          {sortMap.map((item, index) => (
            <Pressable
              key={item}
              onPress={() => {
                setSortIndex(index)
              }}
            >
              <Text
                className='text-base'
                style={{
                  color: index === sortIndex ? secondaryColor : ignoreTextColor
                }}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </TransparentView>
      </BlurView>
      <SimpleAuthorList />
    </TransparentView>
  )
}

export const SearchSelector = () => {
  const [index, setIndex] = useState(0)
  return (
    <TransparentView className='flex-1'>
      <BlurView intensity={80}>
        <TransparentView className='w-48'>
          <Tab
            value={index}
            onChange={setIndex}
            containerStyle={{
              height: 50
            }}
            titleStyle={{
              fontSize: 14,
              color: secondaryColor
            }}
            indicatorStyle={{
              backgroundColor: secondaryColor,
              width: '20%',
              left: '15%'
            }}
          >
            <Tab.Item title={'Video'} />
            <Tab.Item title={'Author'} />
          </Tab>
        </TransparentView>
      </BlurView>
      <TabView
        value={index}
        onChange={setIndex}
      >
        <TabView.Item className='flex-1'>
          <SearchVideoTab />
        </TabView.Item>
        <TabView.Item className='flex-1'>
          <SearchUserTab />
        </TabView.Item>
      </TabView>
    </TransparentView>
  )
}
