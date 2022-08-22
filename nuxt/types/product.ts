import type { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types/v4'

export type Image = {
	size: number
	updatedAt: string
	url: string
	width: number
}

export type Variant = {
	weight: string
	price: number
}

export type Product = {
	id: number
	name: string
	slug: string
	brief: string
	description: string
	composition: string
	storage: string
	payment: string
	price: number
	count?: number
	energy: {
		title: string,
		value: string
	}[]
	prices: {
		variants: Variant[]
	}[]
	images: { data: Strapi4ResponseData<Image>[] }
}