<script setup lang="ts">
import AppSidebar from './App/AppSidebar.vue';
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { Product } from '~~/types';
import { stringify } from 'qs'

defineEmits<{
	(event: 'close'): void
}>()

interface ProductResponse {
	data: Strapi4ResponseData<Product>[]
}

const show = ref<boolean>(false)
const sidebar = ref<InstanceType<typeof AppSidebar> | null>(null)

const user = useUser()
const client = useStrapiClient()

const cart = ref(user.value.cart)
const products = ref([])

await fetchCartProducts()

const productsPrice = computed<number>(() => {
	if (user.value?.cart) return products.value.reduce((acc, cv, i) => acc + cart.value[i]?.price * cv.attributes.count, 0)
	else return 0
}) 

const cartFull = computed<boolean>(() => user.value.email && user.value.cart?.length ? true : false)

onMounted(() => (show.value = true))

watch(products, async (val: Strapi4ResponseData<Product>[], oldVal: Strapi4ResponseData<Product>[]) => {
	if (val.length === oldVal.length) {
		cart.value.forEach((item, i ,arr) => {
			const newProduct = val.find(product => product.id === item.id && product.attributes.prices[0].variants[0].weight === item.variant)
			arr[i].count = newProduct.attributes.count
		})

		try {
			await client('/me', { method: 'PUT', body: { ['cart']: cart } })
		} catch (error) {
			console.log(error);
		}
	}
}, { deep: true })

async function removeProduct(id: number, index: number) {
	const product = user.value.cart.filter(product => product.id === id)
	let products = JSON.parse(JSON.stringify(user.value.cart)) as Product[]

	if (product.length > 1) products.splice(index, 1)
	else products = products.filter((product) => product.id !== id)

	try {
		user.value = await client('/me', { method: 'PUT', body: { 'cart': products } })
		cart.value = user.value.cart

		if (cart.value.length) {
			await fetchCartProducts()
		}

	} catch (error) {
		console.log(error);
	}
}

async function fetchCartProducts() {
	const query = stringify({
		filters: {
			id: {
				$in: user.value.email && user.value.cart.length ? cart.value.map(item => item.id) : '',
			},
		},
	}, {
		encodeValuesOnly: true,
	});

	const res = await client<ProductResponse>(`products?${query}&populate=*`).then((res) => {

		res.data.forEach((product, index, arr) => {
			const { images, name } = arr[index].attributes
			const productVariants = cart.value.filter(item => item.id === product.id)

			arr[index].attributes = { images, prices: [ { variants: [{ price: productVariants[0].price, weight: productVariants[0].variant }] } ] }

			if (productVariants.length > 1) {
				productVariants.forEach(productVariant => {
					const variant = { price: productVariant.price, weight: productVariant.variant }
					const variantExist = arr.some(item => productVariant.id === item.id && item.attributes.prices[0].variants.some(({price, weight }) => price === variant.price && weight === variant.weight))
					
					if (!variantExist) {
						const newProduct = JSON.parse(JSON.stringify(product))

						newProduct.attributes.name = `${name} (${productVariant?.variant})`
						newProduct.attributes.count = productVariant.count || 1
						newProduct.attributes.prices[0].variants[0].price = productVariant.price
						newProduct.attributes.prices[0].variants[0].weight = productVariant.variant

						arr.push(newProduct)
					}
				})
			}
			
			arr[index].attributes.count = productVariants[0].count,
			arr[index].attributes.name = `${name} (${productVariants[0].variant})`
		})

		return res
	})

	products.value = res.data
}

async function test() {
	const paymentLink = await client<string>('/me/order', { method: 'PUT' })
	if (paymentLink) window.open(paymentLink, '_self')
}
</script>

<template>
	<AppSidebar 
		ref="sidebar"
		@close="$emit('close')"
	>
		<div class="flex flex-col h-full">
			<section class="flex items-center space-x-4 border-b-2 border-gray-600 px-4 h-[10%]">
				<button 
					class="appearance-none w-6 h-6" 
					@click="sidebar.close()"
				>
					<IconTablerX class="w-6 h-6" />
				</button>

				<span class="font-medium text-lg">
					Кошик
				</span>
			</section>

			<section class="px-4 py-8 h-[60%] overflow-y-auto">
				<ul 
					v-if="cartFull" 
					class="space-y-8"
				>
					<li 
						v-for="(product, i) in products" 
						:key="product.attributes.slug" 
						class="flex space-x-4"
					>
						<div class="flex items-center justify-center min-h-24 min-w-24 bg-stone-100 p-2">
							<img class="w-22 h-28" :src="product.attributes.images.data[0].attributes.formats.small.url">
						</div>

						<div class="flex flex-col justify-between">
							<span class="font-semibold max-w-38 lg:max-w-64">
								{{ product.attributes.name }}
							</span>

							<AppNumberInput v-model="product.attributes.count" />
						</div>

						<div class="flex flex-col justify-between items-end !ml-auto">
							<span class="font-medium">
								{{ product.attributes.prices[0].variants[0].price }} ₴
							</span>

							<button @click="removeProduct(product.id, i)">
								<IconTablerTrash class="!font-thin w-6 h-6 !text-gray-600" />
							</button>
						</div>
					</li>
				</ul>

				<p v-else class="flex justify-center items-center text-2xl font-medium h-full">
					Кошик порожній
				</p>
			</section>

			<section 
				v-if="cartFull"
				class="flex flex-col justify-between border-t-2 border-gray-600 h-[15%] px-4 pt-3"
			>
				<div class="flex justify-between items-center text-xl font-semibold uppercase">
					<span>Всього</span>
					<span>{{ productsPrice.toFixed(2) }} грн</span>
				</div>

				<button
					class="w-full appearance-none border-2 border-gray-600 h-14 text-xl font-medium bg-green-200" 
					@click="test()"
				>
					Оплатити
				</button>
			</section>
		</div>
	</AppSidebar>
</template>