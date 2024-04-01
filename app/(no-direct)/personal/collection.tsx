import { getPlayList } from '@/api/media';
import { useAppSelector } from '@/store/hook';
import { NotTabView } from '@/components/CommonView';
import { PlayList } from '@/.expo/types/media';
import { Text, TransparentView } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { CollectionList } from '@/components/CollectionScreen';
import { ScrollView } from 'react-native';

export default function CollectionScreen() {
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const [playList, setPlayList] = useState<PlayList[]>([]);

  useEffect(() => {
    const fetchPlayList = async () => {
      await getPlayList().then((response) => {
        const { result } = response;
        setPlayList(result);
        console.log(result);
      });
    };
    fetchPlayList();
  }, []);

  return (
    <NotTabView
      contentStyle='px-5 '
      headerStyle='mb-2'
      headerComponent={<Text className='pr-3 text-lg'>Your Collection</Text>}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TransparentView>
          {playList.map((item) => (
            <CollectionList
              playList={item}
              key={item.id}
            />
          ))}
        </TransparentView>
      </ScrollView>
    </NotTabView>
  );
}
