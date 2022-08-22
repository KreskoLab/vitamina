<script setup lang="ts">
defineEmits<{
	(event: 'select'): void
}>()
</script>

<template>
	<li 
		class="flex items-center w-full h-full border-b-2 border-x-2 border-gray-600 py-5 px-4 cursor-pointer"
		@click="$emit('select')"
	>
		<slot />
	</li>
</template>