<script setup lang="ts">
const routes = [
	{
		name: 'Персональні дані',
		link: '/account/'
	},

	{
		name: 'Адреса доставки',
		link: '/account/adress/'
	},

	{
		name: 'Замовлення',
		link: '/account/orders/'
	}
]
</script>

<template>
	<div class="flex flex-row space-x-20 w-full h-[calc(100vh-5.5rem)] py-12 px-64">
		<ul class="rounded-2xl bg-[#F7E3DF] border-2 border-dark-600 w-64 py-8 px-12 h-max text-lg space-y-3">
			<li 
				v-for="route in routes" 
				:key="route.name" 
				:class="{ 'font-medium': $route.path === route.link }"
			>
				<NuxtLink :to="route.link">
					{{ route.name }}
				</NuxtLink>
			</li>
		</ul>

		<div
			class="bg-[#DDE8EB] border-2 border-dark-600 py-6 px-12 w-[560px] h-116 flex-grow-0"
		>
			<NuxtPage />
		</div>
	</div>
</template>

<style scoped>
button {
	@apply
	transition duration-200
	ring-offset-2 ring-[1px] ring-dark-200 ring-offset-emerald-50
	active:(ring-offset-emerald-200)
}
</style>
