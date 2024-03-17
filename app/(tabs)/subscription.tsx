import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/Themed';
import {
  SubscriptionAuthorList,
  SubscriptionVideoList,
} from '@/components/SubscriptionScreen';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function SubscriptionScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1 px-4'
      style={{
        paddingBottom: tabBarHeight,
      }}>
      <Text className='text-xl my-4'>Subscription</Text>
      <SubscriptionAuthorList />
      <SubscriptionVideoList />
    </LinearGradient>
  );
}
