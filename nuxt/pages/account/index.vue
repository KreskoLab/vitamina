<script setup lang="ts">
import type { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types/v4'
import { Form } from '~/types';

const { find } = useStrapi4()

interface FormReponse {
	form: Form[]
}

const client = useStrapiClient()
const user = useUser()

const userSettings: { [key: string]: string } = reactive({})

const formData: { data: Strapi4ResponseData<FormReponse> } = await find('user-settings-form')

async function updateUser() {
	if (Object.keys(userSettings).length) {
		await client('/me', { method: 'PUT', body: { ...userSettings, filled: true } })
			.then(async () => await useFetchUser())
	}
}
</script>

<template>
	<div>
		<h1 class="font-semibold text-2xl">Мій аккаунт</h1>
  
		<form
			class="grid grid-cols-2 gap-y-12 gap-x-8 mt-12"
			@submit.prevent="updateUser()"
		>
			<AppInput
				v-for="item in formData.data.attributes.form"
				:key="item.label"
				v-model="user[item.value]"
				:label="item.label"
				:class="[item.full ? 'col-span-full' : 'col-span-1']"
				:type="item.type"
				:required="item.required"
				:pattern="item.pattern"
				:message="item.message"
				:placeholder="item.placeholder"
				@input="userSettings[item.value] = $event"
			/>

			<button class="bg-emerald-200 py-2 px-4 border-2 border-dark-100">
				<span class="text-lg">Зберегти</span>
			</button>
		</form>
	</div>
</template>