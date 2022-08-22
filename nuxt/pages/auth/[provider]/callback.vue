<script setup lang="ts">
const { authenticateProvider } = useStrapiAuth()
const route = useRoute()
const router = useRouter()

await authenticateProvider(route.params.provider as string, route.query.access_token as string)

onMounted(async () => {
	const user = await useUser()
	let path = ''

	if (user.value.filled) path = localStorage.getItem('redirect') || '/'
	else path = '/user/settings'

	router.push(path)
})
</script>

<template>
	<div>processing</div>
</template>
