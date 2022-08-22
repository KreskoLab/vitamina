<script setup lang="ts">
import { Category } from '~/types/category';
import type { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types/v4'
import { Product } from '~/types/product';

interface CategoryResponse {
	data: Strapi4ResponseData<
	Category & { products: { data: Strapi4ResponseData<Product>[] } }
	>[]
}

const client = useStrapiClient()
const route = useRoute()

const param = route.params.category as string

const category = await client<CategoryResponse>(`categories?filters[slug][$eq]=${param}&populate[products][populate]=*`)
</script>

<template>
	<div 
		class="flex flex-col w-full h-[calc(100vh-5rem)] lg:(h-[calc(100vh-5.5rem)]) overflow-y-auto"
		:style="`background-color: ${category.data[0].attributes.color}`"
	>
		<section class="flex flex-col space-y-1 pt-5 lg:(space-y-3 px-12 pt-6)">
			<h1 class="text-center text-4xl lg:(text-6xl font-normal) font-medium text-dark-200 uppercase tracking-widest">{{ category.data[0].attributes.name }}</h1>
			<p class="text-2xl italic text-center lg:(uppercase)">{{ category.data[0].attributes.subtitle }}</p>
		</section>

		<section class="mt-8 grid place-items-center grid-cols-2 gap-x-6 gap-y-3 px-4 lg:(grid-cols-3 gap-6 px-32) pb-8">
			<ProductCard 
				v-for="product in category.data[0].attributes.products.data"
				:key="product.id" 
				:name="product.attributes.name" 
				:price="product.attributes.prices[0].variants[0].price" 
				:slug="product.attributes.slug"
				:image="product.attributes.images.data[0].attributes.formats.small.url"
				:category="param"
			/>
		</section>
	</div>
</template>
