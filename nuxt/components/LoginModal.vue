<script setup lang="ts">
const show = ref<boolean>(false)

const route = useRoute()

const emit = defineEmits<{
	(event: 'close'): void
}>()

function close() {
	emit('close')
}

function auth(provider: string) {
	localStorage.setItem('redirect', route.path)
	window.location.href = `http://localhost:1337/api/connect/${provider}`
}

onMounted(() => (show.value = true))
</script>

<template>
	<Teleport to="body">
		<div
			class="flex justify-center items-center fixed top-0 left-0 h-full w-full bg-dark-600/60 transition-all duration-150 ease-in-out"
		>
			<Transition
				enter-active-class="animate-animated animate-faster animate-fadeInUp"
				leave-active-class="animate-animated animate-faster animate-fadeOutDown"
				@after-leave="close()"
			>
				<dialog
					v-if="show"
					class="w-[420px] h-[380px] bg-gradient-19 p-4"
					open
				>
					<div
						class="relative flex flex-col justify-center w-full h-full border-2 border-gray-600 bg-light-50"
					>
						<section class="flex flex-col items-center space-y-1 justify-center">
							<img
								width="248"
								height="248"
								src="@/assets/appy3.svg"
								alt="logo"
							/>

							<p class="font-medium text-2xl text-center italic text-dark-100">
								Увійти за допомогою
							</p>
						</section>

						<section class="flex flex-col items-center space-y-6 mt-8">
							<button
								class="hover:bg-orange-200 auth-button"
								@click="auth('google')"
							>
								<IconTablerBrandGoogle class="w-5 h-5" />
								<span class="text-lg font-medium mx-auto">Google</span>
							</button>

							<button
								class="hover:bg-sky-200 auth-button"
								@click="auth('facebook')"
							>
								<IconTablerBrandFacebook class="w-5 h-5" />
								<span class="text-lg font-medium mx-auto">Facebook</span>
							</button>
						</section>

						<button
							class="flex items-center justify-center absolute top-5 right-5 outline-transparent"
							@click="show = false"
						>
							<IconTablerX
								class="w-5 h-5 text-gray-400 hover:text-red-600 transition duration-150"
							/>
						</button>
					</div>
				</dialog>
			</Transition>
		</div>
	</Teleport>
</template>

<style scoped>
.fancy-border {
	border: 5px solid;
	border-image: linear-gradient(to left, #10b981, #ec4899) 1;
}

.auth-button {
	@apply flex items-center border-2 border-dark-50 py-2 px-3 w-10/12
  transition duration-200 ease-in-out
  hover:ring-transparent
  ring-[1px] ring-dark-200 ring-offset-2;
}
</style>
