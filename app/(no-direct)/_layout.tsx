import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';

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
						name='personal/video'
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name='personal/collection'
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name='personal/information'
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name='video-play/[videoId]'
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name='live-play/[liveId]'
						options={{ headerShown: false }}
					/>
				</Stack>
			</ThemeProvider>
		</LinearGradient>
	);
}
