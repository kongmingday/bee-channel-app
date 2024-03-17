import { LinearGradient } from 'expo-linear-gradient'
import { SearchBar, Tab, TabView, Avatar } from '@rneui/themed'
import { useState } from 'react'
import {
  MaterialIcon,
  TransparentView,
  FontistoIcon
} from '@/components/Themed'
import { HomeHeader, HomeSelectTab } from '@/components/HomeScreen'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

export default function HomeScreen() {
  const tarBarHeight = useBottomTabBarHeight()
  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1'
      style={{
        paddingBottom: tarBarHeight
      }}
    >
      <HomeHeader />
      <HomeSelectTab />
    </LinearGradient>
  )
}

