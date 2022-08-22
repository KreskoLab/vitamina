import { Ref } from 'vue'
import type { User } from '~/types'

export const useUser = () => useState<User>('user')

export const useFetchUser = async () => {
	const user = useState('user', () => ({}) as Ref<User>)
	const client = useStrapiClient()
  
	try {
		const response = await client<User>('/users/me?populate[cart][populate][0]=images')
		user.value = response
	} catch (error) {
		user.value = {} as User
	}
}
