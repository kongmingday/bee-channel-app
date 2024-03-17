import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, router } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchHeader } from '@/components/SearchScreen';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1'>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name='search'
            options={{
              headerShown: true,
              headerTransparent: true,
              title: '',
              header: () => {
                return <SearchHeader />;
              },
            }}
          />
          <Stack.Screen
            name='video-play/[videoId]'
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </LinearGradient>
  );
}
