import { BackgroundView } from '@/components/CommonView';
import { SearchSelector } from '@/components/SearchScreen';

export default function SearchScreen() {
	return (
		<BackgroundView
			className='flex-1'
			style={{
				paddingTop: 60,
			}}>
			<SearchSelector />
		</BackgroundView>
	);
}
