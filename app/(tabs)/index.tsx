import { BackgroundView } from '@/components/CommonView';
import { HomeHeader, HomeSelectTab } from '@/components/HomeScreen';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function HomeScreen() {
	const tarBarHeight = useBottomTabBarHeight();
	return (
		<BackgroundView
			className='flex-1'
			style={{
				paddingBottom: tarBarHeight,
			}}>
			<HomeHeader />
			<HomeSelectTab />
		</BackgroundView>
	);
}
