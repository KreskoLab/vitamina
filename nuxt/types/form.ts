import type { User } from "./user"

export type Form = {
	label: string
	value: keyof Omit<User, 'cart' | 'favorites' | 'id' | 'filled'>
	type: string
	full: boolean,
	required: true,
	message: string,
	pattern?: string,
	placeholder?: string
}