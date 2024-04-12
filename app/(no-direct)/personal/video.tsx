import { getAuthorVideoList } from '@/api/media';
import { SimpleVideoList } from '@/components/VideoAssembly';
import { useAppSelector, useFetchDataPage } from '@/store/hook';
import { NotTabView } from '@/components/CommonView';
import { SimpleMedia } from '@/.expo/types/media';
import { UserAndRelationship } from '@/.expo/types/auth';
import { Text } from '@/components/Themed';

export default function VideosScreen() {
	const userInfo = useAppSelector(state => state.app.userInfo);
	const fetchVideoFunction = useFetchDataPage<SimpleMedia, SimpleMedia, any>(
		getAuthorVideoList,
		true,
		data => {
			data.forEach(item => {
				item.author = { username: userInfo?.username } as UserAndRelationship;
			});
			return data;
		},
		undefined,
		{
			authorId: userInfo?.id,
		},
	);

	return (
		<NotTabView
			contentStyle='px-5 '
			headerStyle='mb-2'
			headerComponent={<Text className='pr-3 text-lg'>Your Videos</Text>}>
			<SimpleVideoList fetchFunction={fetchVideoFunction} />
		</NotTabView>
	);
}
