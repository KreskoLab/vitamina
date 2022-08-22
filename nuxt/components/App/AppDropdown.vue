<script setup lang="ts">
const active = ref<boolean>(false)
const button = ref<HTMLElement | null>(null)

onClickOutside(button, () =>  active.value = false)
</script>

<template>
	<div class="relative h-full w-full">
		<button 
			ref="button"
			class="h-full transition-all duration-400 w-full truncate overflow-hidden" 
			:class="{ '!border-gray-600': active }"
			@click="active = !active"
		>
			<slot />
		</button>

		<Transition
			enter-active-class="animate-animated animate-faster animate-fadeIn"
			leave-active-class="animate-animated animate-faster animate-fadeOut"
		>
			<ul v-if="active" class="transform scale-x-102 border-gray-600 absolute top-full w-full bg-light-50 z-90">
				<slot name="menu" />
			</ul>
		</Transition>
	</div>
</template>