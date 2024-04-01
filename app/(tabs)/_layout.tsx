import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return (
    <MaterialIcons
      size={28}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1'>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarStyle: { position: 'absolute', shadowColor: 'transparent' },
          tabBarBackground: () => (
            <BlurView
              tint='light'
              intensity={80}
              className='flex-1'
            />
          ),
          headerShown: false, //useClientOnlyValue(false, true),
        }}>
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name='houseboat'
                color={color}
              />
            ),
            headerRight: () => (
              <Link
                href='/modal'
                asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name='info-circle'
                      size={25}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name='subscription'
          options={{
            title: 'Subscription',
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name='subscriptions'
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='user'
          options={{
            title: 'User',
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name='person'
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </LinearGradient>
  );
}
