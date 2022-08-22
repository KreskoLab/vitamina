<script setup lang="ts">
import type { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types/v4'
import type { Category, Subcategory } from '~/types'

interface CategoriesResponse {
	data: Strapi4ResponseData<
	Category & { subcategories: { data: Strapi4ResponseData<Subcategory>[] } }
	>[]
}

const route = useRoute()
const { find } = useStrapi4()

const categories = await find<CategoriesResponse>('categories', {
	populate: 'subcategories',
	fields: ['name', 'slug'],
})

const isActive = (param: string) => param === route.params.category ? true : false
</script>

<template>
	<ul class="flex justify-between lg:space-x-12 w-full h-full list-none">
		<li
			v-for="category in categories.data"
			:key="category.id"
			class="relative group h-full cursor-pointer decorator"
			:class="{ 'after:(!w-full)': isActive(category.attributes.slug) }"
		>
			<nuxt-link
				:to="`/${category.attributes.slug}`"
				class="text-sm lg:text-xl font-medium text-dark-100 h-full flex items-center"
				:class="{ 'text-dark-400': isActive(category.attributes.slug) }"
			>
				{{ category.attributes.name }}
			</nuxt-link>
		</li>
	</ul>
</template>

<style scoped>
.decorator {
	@apply
	after:(content-DEFAULT absolute top-5 lg:top-14 w-0 h-[2px] bg-yellow-500 transition-all duration-500)
	after:hover:(bg-teal-300 w-full)
}
</style>