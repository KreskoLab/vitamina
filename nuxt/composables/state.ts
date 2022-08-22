export const useCart = () => {
	return useState('cart', () => false)
}

export const useLogin = () => {
	return useState('login', () => false)
}