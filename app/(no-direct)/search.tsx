import { SearchSelector } from '@/components/SearchScreen'
import { LinearGradient } from 'expo-linear-gradient'

export default function SearchScreen() {
  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1'
      style={{
        paddingTop: 60
      }}
    >
      <SearchSelector />
    </LinearGradient>
  )
}
