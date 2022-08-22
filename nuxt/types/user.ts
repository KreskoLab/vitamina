import { Product } from "./product"

export type User = {
	id: number
	username: string
	name: string
	surname: string
	email: string
	phone: string
	filled: boolean
	region: string
	city: string
	adress: string
	adress2: string
	postcode: string
	cart: {
		id: number
		count: number,
		price: number,
		variant: string
	}[]
	favorites: Product[]
}
