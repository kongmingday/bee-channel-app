import { getSubscription } from '@/api/user';
import { NotTabView } from '@/components/CommonView';
import { Text } from '@/components/Themed';
import { SimpleAuthorList } from '@/components/VideoAssembly';
import { useAppDispatch, useFetchDataPage } from '@/store/hook';
import { changeUserFetchFunction } from '@/store/slices/searchSlice';

export default function AuthorScreen() {
	const dispatch = useAppDispatch();

	const fetchUserFunction = useFetchDataPage<any, any, any>(
		getSubscription,
		false,
		undefined,
		undefined,
	);

	dispatch(changeUserFetchFunction(fetchUserFunction));
	return (
		<NotTabView
			contentStyle='px-5 '
			headerStyle='mb-5'
			headerComponent={<Text className='pr-3 text-lg'>Your Subscription</Text>}>
			<SimpleAuthorList />
		</NotTabView>
	);
}
