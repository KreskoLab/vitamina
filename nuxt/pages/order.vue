<script setup lang="ts">
const client = useStrapiClient()
const user = useUser()
const router = useRouter()

onMounted(async () => {
	user.value = await client('/me/order', { method: 'GET' })
	router.push('/account/orders')
})
</script>

<template>
	<div />
</template>