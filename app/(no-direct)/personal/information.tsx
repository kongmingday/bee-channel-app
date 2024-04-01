import { NotTabView } from '@/components/CommonView';
import { Text } from '@/components/Themed';
import { InformationList } from '@/components/InformationScreen';
import { useCallback, useEffect, useState } from 'react';
import { AllUserInfo } from '@/.expo/types/auth';
import { getUserInfo } from '@/api/user';
import { useFocusEffect } from 'expo-router';

export default function InformationScreen() {
  const [userInfo, setUserInfo] = useState<AllUserInfo>({} as AllUserInfo);

  useFocusEffect(
    useCallback(() => {
      const getInfo = async () => {
        const { result: userInfo } = await getUserInfo();
        setUserInfo(userInfo);
      };
      getInfo();
    }, []),
  );

  return (
    <NotTabView
      contentStyle='px-5 '
      headerStyle='mb-5'
      headerComponent={<Text className='pr-3 text-lg'>Your Information</Text>}>
      <InformationList userInfo={userInfo} />
    </NotTabView>
  );
}
