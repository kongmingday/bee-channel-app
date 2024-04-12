import { PlayList, SimpleMedia } from '@/.expo/types/media';
import { ListItem } from '@rneui/base';
import { TransparentView, Text, IonIcon, FeatherIcon } from './Themed';
import { useEffect, useState } from 'react';
import { dateFormat } from '@/utils/common/calculateUtil';
import { SimpleVideoList } from './VideoAssembly';
import { useFetchDataPage } from '@/store/hook';
import { getVideoByPlayListId } from '@/api/media';
import { Pressable } from 'react-native';
import { DeleteCollectionDialog, UpdateCollectionDialog } from './ExtendModal';

export const CollectionList = (props: {
	playList: PlayList;
	fetchPlayList: () => any;
}) => {
	const { playList, fetchPlayList } = props;

	const [isDeleteVisible, setDeleteVisibleState] = useState<boolean>(false);
	const [isUpdateVisible, setUpdateVisibleState] = useState<boolean>(false);

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

	useEffect(() => {
		if (!isDeleteVisible) {
			fetchPlayList();
		}
	}, [isDeleteVisible]);

	useEffect(() => {
		if (!isUpdateVisible) {
			fetchPlayList();
		}
	}, [isUpdateVisible]);

	return (
		<>
			<ListItem.Accordion
				isExpanded={isExpanded}
				onPress={() => {
					setExpandedState(!isExpanded);
				}}
				containerStyle={{
					backgroundColor: 'rgba(255,255,255,0.5)',
					borderRadius: 20,
				}}
				content={
					<TransparentView className='flex-1 flex-row items-center'>
						<TransparentView className='flex-1'>
							<Text className='text-lg'>{playList.name}</Text>
							<Text>{`Create Time: ${dateFormat(
								playList.createTime,
								'YYYY-MM-DD',
							)}`}</Text>
						</TransparentView>
						<TransparentView
							className='flex flex-row items-center'
							style={{
								columnGap: 10,
							}}>
							<Pressable
								onPress={() => {
									setDeleteVisibleState(true);
								}}>
								<IonIcon
									name='close'
									size={18}
									color={'#000'}
								/>
							</Pressable>
							<Pressable
								onPress={() => {
									setUpdateVisibleState(true);
								}}>
								<FeatherIcon
									name='edit'
									size={15}
									color={'#000'}
								/>
							</Pressable>
						</TransparentView>
					</TransparentView>
				}>
				<ListItem
					containerStyle={{
						backgroundColor: 'transparent',
						borderRadius: 20,
						padding: 0,
					}}
					className='bg-transparent'>
					<SimpleVideoList
						isFavorites
						headerComponent={<></>}
						fetchFunction={fetchFunction}
						playListId={playList.id}
					/>
				</ListItem>
			</ListItem.Accordion>
			<DeleteCollectionDialog
				playList={playList}
				visibleState={[isDeleteVisible, setDeleteVisibleState]}
			/>
			<UpdateCollectionDialog
				playList={playList}
				visibleState={[isUpdateVisible, setUpdateVisibleState]}
			/>
		</>
	);
};
