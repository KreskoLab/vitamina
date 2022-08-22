<script setup lang="ts">
const props = defineProps<{
	modelValue: number
}>()

const emit = defineEmits<{
	(event: 'update:modelValue', num: number): void
}>()

const num = ref(props.modelValue || 1)

function handleNumber(type: 'inc' | 'dec') {
	switch (type) {
		case 'inc':
			num.value++      
			emit('update:modelValue', num.value)

			break;
 
		case 'dec':
			if (num.value > 1) {
				num.value--
				emit('update:modelValue', num.value)
			}

			break;
	}
}
</script>

<template>
	<div class="flex justify-between rounded-full border-2 border-gray-600 w-26 h-7">
		<button class="border-r-2" @click="handleNumber('dec')">
			<IconTablerMinus />
		</button>

		<span class="flex items-center justify-center w-[40%] font-medium">{{ num }}</span>

		<button class="border-l-2" @click="handleNumber('inc')">
			<IconTablerPlus />
		</button>
	</div>
</template>

<style scoped> 
svg {
  @apply text-gray-600 w-4 h-4
}

button {
  @apply flex items-center justify-center w-[30%] appearance-none border-gray-600 p-1 rounded-full hover:(bg-amber-300 text-white)
}
</style>