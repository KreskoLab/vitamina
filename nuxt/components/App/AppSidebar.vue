<script setup lang="ts">
const show = ref<boolean>(false)

function close() {
	show.value = false
}

onMounted(() => show.value = true)

defineEmits<{
	(event: 'close'): void
}>()

defineExpose({
	close
})
</script>

<template>
	<Teleport to="body">
		<div class="fixed top-20 lg:top-22 left-0 h-full w-full bg-dark-600/30 z-50">
			<Transition
				enter-active-class="animate-animated animate-faster animate-fadeInRight"
				leave-active-class="animate-animated animate-faster animate-fadeOutRight"
				appear
				@after-leave="$emit('close')" 
			>
				<aside 
					v-if="show"
					class="fixed top-20 right-0 border-gray-600 bg-light-50 h-full w-full lg:(top-22 w-126 border-l-2)">
					<slot />
				</aside>
			</Transition>
		</div>
	</Teleport>
</template>