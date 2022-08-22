<script setup lang="ts">
defineProps<{
	label?: string
	modelValue?: string,
	type?: string,
	placeholder?: string
	required?: boolean,
	pattern?: string,
	message?: string
}>()

const emit = defineEmits<{
	(event: 'input', data: string): void
}>()

const input = ref<HTMLInputElement | null>(null)

const handleInput = () => {
	input.value.setCustomValidity('')
	emit('input', input.value.value)
}
</script>

<template>
	<div class="relative w-full">
		<label
			v-if="label"
			class="absolute -top-7 left-0 text-lg"
		>
			{{ label }}
		</label>

		<input
			ref="input"
			:placeholder="placeholder"
			:required="required"
			:value="modelValue"
			:type="type || 'text'"
			:pattern="pattern"
			@input="handleInput"
			@invalid="input.setCustomValidity(message)"
		/>
	</div>
</template>

<style scoped>
input {
	@apply 
	appearance-none
  w-full
  border-2 border-gray-600 
  py-2 px-3 
  focus:outline-none
}
</style>
