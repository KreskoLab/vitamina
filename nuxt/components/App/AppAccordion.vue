<script setup lang="ts">
const active = ref<boolean>(false)
const ended = ref<boolean>(false)

function enter(element: HTMLElement) {
	const width = getComputedStyle(element).width;

	element.style.width = width;
	element.style.position = 'absolute';
	element.style.visibility = 'hidden';
	element.style.height = 'auto';

	const height = getComputedStyle(element).height;

	element.style.width = null;
	element.style.position = null;
	element.style.visibility = null;
	element.style.height = '0';

	getComputedStyle(element).height;

	requestAnimationFrame(() => {
		element.style.height = height;
	});
}

function afterEnter(element: HTMLElement) {
	element.style.height = 'auto';
	ended.value = true
}

function leave(element: HTMLElement) {
	const height = getComputedStyle(element).height;
	element.style.height = height;

	getComputedStyle(element).height;

	requestAnimationFrame(() => {
		element.style.height = '0';
	});

	ended.value = false
}
</script>

<template>
	<div class="w-full h-full">
		<button
			class="flex items-center justify-between w-full" 
			@click="active = !active"
		>
			<slot name="trigger" />

			<IconTablerChevronDown v-if="!ended" class="w-6 h-6" />
			<IconTablerChevronUp v-else class="w-6 h-6" />
		</button>

		<Transition
			name="expand"
			@enter="enter"
			@after-enter="afterEnter"
			@leave="leave"
		>
			<div v-show="active" class="mt-2">
				<slot name="content" />
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.5s ease-in-out;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>