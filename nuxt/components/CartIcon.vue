<script setup lang="ts">
const user = await useUser()
const cart = useCart()

const products = computed(() => user.value.cart?.length || 0)
const newProduct = ref(false)

watch(() => products.value, () => {  
	newProduct.value = true
})
</script>

<template>
	<button
		class="relative w-9 h-9" 
		@click="cart = true"
	>
		<svg class="absolute -top-0.9 !fill-dark-100 !stroke-dark-100" viewBox="0 0 60 60">
			<path d="m14.6 26.4c-.2 0-.4-.1-.6-.2-.4-.3-.5-1-.2-1.4l5.1-6.8c.2-.3.5-.4.8-.4h20.5c.3 0 .6.1.8.4l5.1 6.8c.3.4.2 1.1-.2 1.4s-1.1.2-1.4-.2l-4.8-6.4h-19.5l-4.8 6.4c-.2.2-.5.4-.8.4z" /> 

			<Transition 
				enter-active-class="animate-animated animate-fast animate-fadeInDownBig"
				@after-enter="newProduct = false"
			>
				<path 
					v-if="newProduct"
					d="m38 18.5c-4.8-5.5-8.4 1.8-8.4 1.8s-3.6-7.4-8.4-1.8 8.4 15.4 8.4 15.4 13.1-9.9 8.4-15.4z" 
					class="fill-rose-500" 
				/>
			</Transition>

			<rect 
				width="29" 
				height="26" 
				y="26" 
				x="15.5" 
				rx="0"
				:class="[ products > 0 ? 'fill-teal-200' : 'fill-white' ]"
			/> 

			<Transition
				enter-active-class="animate-animated animate-fast animate-fadeIn"
				leave-active-class="animate-animated animate-fast animate-fadeOut"
			>
				<text :key="products" x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" class="transition-all duration-300 text-white font-medium">
					{{ products }}
				</text> 
			</Transition>

			<g>
				<path d="m41.9 53.7h-23.8c-1.1 0-2.3-.5-3.1-1.3s-1.3-2-1.3-3.1v-23.9c0-.6.4-1 1-1s1 .4 1 1v23.9c0 .6.3 1.3.7 1.7s1.1.7 1.7.7h23.9c.6 0 1.3-.3 1.7-.7s.7-1.1.7-1.7v-23.9c0-.6.4-1 1-1s1 .4 1 1v23.9c0 1.1-.5 2.3-1.3 3.1-.9.8-2 1.3-3.2 1.3z" /> 
				<path d="m45.3 26.4h-30.6c-.6 0-1.1-.4-1.1-1s.5-1 1.1-1h30.6c.6 0 1.1.4 1.1 1s-.5 1-1.1 1z" />
			</g> 
		</svg>
	</button>
</template>