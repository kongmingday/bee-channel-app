import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Toast } from '@/components/Toast';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BackgroundView } from '@/components/CommonView';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaProvider>
			<Provider store={store}>
				<GestureHandlerRootView className='flex-1'>
					<BackgroundView
						className='flex-1'
						style={{
							paddingTop: insets.top,
						}}>
						<Toast />
						<ThemeProvider
							value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
							<Stack>
								<Stack.Screen
									name='(tabs)'
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name='(no-direct)'
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name='modal'
									options={{ presentation: 'modal' }}
								/>
								<Stack.Screen
									name='login-modal'
									options={{
										presentation: 'containedModal',
										headerShown: false,
									}}
								/>
							</Stack>
						</ThemeProvider>
					</BackgroundView>
				</GestureHandlerRootView>
			</Provider>
		</SafeAreaProvider>
	);
}
