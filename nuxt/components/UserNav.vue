<script setup lang="ts">
const user = useUser()
const login = useLogin()

const { logout } = useStrapiAuth()

const displayName = computed(() => {
	if (user.value.filled) return `${user.value.name} ${user.value.surname}`
	else return user.value.email
})
</script>

<template>
	<div class="flex items-center justify-center h-full">
		<AppDropdown v-if="user.email" >
			<span class="text-lg h-full px-4">
				{{ displayName }}
			</span>

			<template #menu>
				<AppDropdownItem>
					<NuxtLink class="block w-full" to="/account">
						Аккаунт
					</NuxtLink>
				</AppDropdownItem>

				<AppDropdownItem 
					@click="logout"
				>
					Вийти
				</AppDropdownItem>
			</template>
		</AppDropdown>

		<IconTablerUser
			v-else
			class="w-6 h-6 text-dark-100 cursor-pointer"
			@click="login = true"
		/>
	</div>
</template>