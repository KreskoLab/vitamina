<script setup lang="ts">
const props = defineProps<{
	name: string,
	slug: string,
	category: string,
	price: number,
	image?: string
}>()

const decimalPrice = computed(() => props.price.toFixed(2))
</script>

<template>
	<article class="flex flex-col w-full h-full md:w-84">
		<NuxtLink :to="`/${category}/${slug}`">
			<div class="flex items-center justify-center border-4 border-light-50">
				<img class="w-full md:h-[420px]" :src="image">
			</div>

			<div class="flex flex-col items-center w-full mt-1 lg:mt-2">
				<h1 class="text-base lg:text-xl text-center font-medium text-dark-400 break-words px-2">{{ name }}</h1>
				<span class="text-base lg:text-lg text-dark-100">{{ decimalPrice }} грн</span>
			</div>
		</NuxtLink>
	</article>
</template>