import { getPlayList } from '@/api/media';
import { NotTabView } from '@/components/CommonView';
import { PlayList } from '@/.expo/types/media';
import { IonIcon, Text, TransparentView } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { CollectionList } from '@/components/CollectionScreen';
import { Pressable, ScrollView } from 'react-native';
import { secondaryColor } from '@/constants/Colors';
import { CreateCollectionDialog } from '@/components/ExtendModal';

export default function CollectionScreen() {
	const [isCreateDialogVisible, setCreateDialogState] =
		useState<boolean>(false);
	const [playList, setPlayList] = useState<PlayList[]>([]);

	const fetchPlayList = async () => {
		await getPlayList().then(response => {
			const { result } = response;
			setPlayList(result);
		});
	};
	useEffect(() => {
		fetchPlayList();
	}, [isCreateDialogVisible]);

	return (
		<NotTabView
			contentStyle='px-5 '
			headerStyle='mb-4'
			headerComponent={
				<>
					<Text className='pr-3 text-lg'>Your Collection</Text>
					<Pressable
						onPress={() => {
							setCreateDialogState(true);
						}}>
						<IonIcon
							name='add'
							color={secondaryColor}
						/>
					</Pressable>
				</>
			}>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}>
				<TransparentView
					style={{
						rowGap: 10,
					}}>
					{playList.map(item => (
						<>
							<CollectionList
								fetchPlayList={fetchPlayList}
								playList={item}
								key={item.id}
							/>
						</>
					))}
				</TransparentView>
			</ScrollView>

			<CreateCollectionDialog
				visibleState={[isCreateDialogVisible, setCreateDialogState]}
			/>
		</NotTabView>
	);
}
