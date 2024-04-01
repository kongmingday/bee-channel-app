import { PlayList, SimpleMedia } from '@/.expo/types/media';
import { ListItem } from '@rneui/base';
import { TransparentView, Text } from './Themed';
import { useState } from 'react';
import { dateFormat } from '@/utils/common/calculateUtil';
import { SimpleVideoList } from './VideoAssembly';
import { useFetchDataPage } from '@/store/hook';
import { getVideoByPlayListId } from '@/api/media';

export const CollectionList = (props: { playList: PlayList }) => {
  const { playList } = props;

  const [isExpanded, setExpandedState] = useState<boolean>(false);

  const fetchFunction = useFetchDataPage<SimpleMedia>(
    getVideoByPlayListId,
    false,
    undefined,
    undefined,
    {
      playListId: playList.id,
    },
  );

  return (
    <ListItem.Accordion
      isExpanded={isExpanded}
      onPress={() => {
        setExpandedState(!isExpanded);
      }}
      containerStyle={{
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 20,
        marginBottom: 10,
      }}
      content={
        <TransparentView className='flex-1'>
          <Text className='text-lg'>{playList.name}</Text>
          <Text>{`Create Time: ${dateFormat(
            playList.createTime,
            'YYYY-MM-DD',
          )}`}</Text>
        </TransparentView>
      }>
      <ListItem
        containerStyle={{
          backgroundColor: 'transparent',
          borderRadius: 20,
          padding: 0,
        }}
        className='bg-transparent'>
        <SimpleVideoList fetchFunction={fetchFunction} />
      </ListItem>
    </ListItem.Accordion>
  );
};
