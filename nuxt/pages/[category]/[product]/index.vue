<script setup lang="ts">
import type { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types/v4'
import type { Product, Variant } from '~/types/product';
import { marked } from 'marked';

interface ProductResponse {
	data: Strapi4ResponseData<Product>[]
}

const client = useStrapiClient()
const route = useRoute()
const user = useUser()
const login = useLogin()

const param = route.params.product as string

const { data: response } = await client<ProductResponse>(`products?filters[slug][$eq]=${param}&populate=*`)
const { name, images, prices, brief, ...rest } = response[0].attributes

const computedAttributes = computed(() => Object.fromEntries(Object.entries(attirbutes).filter(([key]) => rest[key]).map(([key]) => {
	return [key, rest[key]]
})))

const cartProduct = reactive({
	id: response[0].id,
	variant: prices[0].variants[0].weight,
	price: prices[0].variants[0].price
})

const attirbutes = {
	description: 'Опис',
	description2: 'Користь складових пастили',
	composition: 'Склад',
	energy: 'Поживна цінність',
	storage: 'Умови зберігання',
	payment: 'Оплата та доставка'
}

const smiles = [
	{
		title: 'Смачно',
		image: 'https://a.storyblok.com/f/54304/x/7201467479/group-612.svg'
	},
	{
		title: 'Поживно',
		image: 'https://a.storyblok.com/f/54304/x/0847c1d2fe/pink-icon.svg'
	},
	{
		title: 'Корисно',
		image: 'https://a.storyblok.com/f/54304/x/ad17edd706/group-614.svg'
	}
]

async function addToCart() {
	if (user.value.email) {
		const payload = user.value.cart || []
		const product = payload.find(item => item.id === cartProduct.id && item.price === cartProduct.price)
		const productEquel = product && (product.variant === cartProduct.variant && product.price === cartProduct.price)

		if (productEquel) product.count++
		else payload.push({ count: 1, ...cartProduct })

		try {
			await client('/me', { method: 'PUT', body: { ['cart']: payload } })
			useFetchUser()
		} catch (error) {
			console.log(error);
		}
	} else login.value = true
}

function selectVariant(variant: Variant) {
	cartProduct.price = variant.price
	cartProduct.variant = variant.weight
}
</script>

<template>
	<article class="flex flex-col h-[calc(100vh-5rem)] top-20 z-10 md:(fixed flex-row h-[calc(100vh-5.5rem)] top-22) bg-[#FCF7F1]">
		<section class="flex flex-col h-full order-last md:(order-first min-w-156 max-w-156 overflow-y-auto)">
			<div class="flex flex-col space-y-4 py-5 px-4 border-t-2 lg:(border-r-2 border-t-0) border-gray-600">
				<h1 class="text-2xl lg:text-4xl text-dark-400 font-medium tracking-wide">{{ name }}</h1>

				<div v-html="marked(brief)" />

				<div class="flex items-center justify-between font-medium text-dark-100">
					<span class="text-lg lg:text-3xl text-orange-400">{{ cartProduct.price }} грн</span>
				</div>
			</div>

			<div class="flex items-center bg-light-50">
				<AppDropdown class="w-48 border-t-2 border-r-2 border-gray-600">
					<template #default>
						<div class="flex items-center justify-evenly">
							<span class="text-center text-xl">
								{{ cartProduct.variant }}
							</span>

							<IconTablerChevronDown class="w-6 h-6" />
						</div>
					</template>

					<template #menu>
						<AppDropdownItem
							v-for="variant in prices[0].variants"
							:key="variant.price"
							@click="selectVariant(variant)"
						>
							{{ variant.weight }}
						</AppDropdownItem>
					</template>
				</AppDropdown>

				<button 
					class="appearance-none bg-[#1D7F75] py-5 flex-grow font-semibold text-xl text-[#FCF7F1] border-t-2 lg:(border-r-2 border-t-2) border-gray-600" 
					@click="addToCart()"
				>
					В кошик
				</button>
			</div>

			<section
				v-for="(item, i) in computedAttributes"
				:key="i"
			>
				<AppAccordion 
					v-if="item"
					class="border-t-2 lg:(border-r-2) border-gray-600 py-5 px-4"
				>
					<template #trigger>
						<h2 class="text-2xl font-semibold text-dark-400 text-left">
							{{ attirbutes[i] }}
						</h2>
					</template>

					<template #content>
						<div 
							v-if="attirbutes[i] !== attirbutes['energy']" 
							v-html="marked(item)" 
						/>

						<table
							v-else 
							class="w-full mt-4 text-sm"
						>
							<tr v-for="row in item" :key="row.title">
								<td>
									<span class="font-medium">
										{{row.title}}
									</span>
								</td>

								<td>
									{{row.value}}
								</td>
							</tr>
						</table>
					</template>
				</AppAccordion>
			</section>

			<div class="grid grid-cols-3 border-y-2 border-gray-600 h-max pt-0">
				<div
					v-for="smile in smiles"
					:key="smile.title"
					class="flex flex-col items-center space-y-1 border-r-2 border-gray-600 py-4"
				>
					<img :src="smile.image" />

					<span>
						{{ smile.title }}
					</span>
				</div>
			</div>
		</section>

		<section class="w-full order-first md:(order-last overflow-y-auto h-full)">
			<ul class="flex w-full overflow-x-auto snap snap-proximity snap-x md:(flex-none grid grid-cols-1) lg:(grid-cols-2)">
				<li 
					v-for="image in images.data" 
					:key="image.id" 
					class="lg:(border-b-2 border-r-2 border-gray-600) bg-[#F0F4F5] snap-start w-full flex-shrink-0 p-10"
				>
					<img 
						class="max-w-full object-contain h-full" 
						:src="image.attributes.url"
					>
				</li>
			</ul>
		</section>
	</article>
</template>

<style scoped>
td {
  padding: 5px 0;
}


</style>