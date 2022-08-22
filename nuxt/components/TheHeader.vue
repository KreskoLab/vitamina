<template>
	<header class="fixed top-0 left-0 w-full h-20 lg:h-22 border-b-2 border-gray-600 bg-light-50 z-99">
		<section class="flex flex-col space-y-1.5 px-4 pt-1 md:hidden">
			<div class="flex items-center">
				<NuxtLink class="flex items-center justify-center" to="/" >
					<img
						class="w-40"
						src="@/assets/appy3.svg"
						alt="logo"
					/>
				</NuxtLink>

				<div class="ml-auto">
					<CartIcon />
				</div>
			</div>

			<div class="flex justify-center">
				<CategoriesList />
			</div>
		</section>

		<section class="hidden md:flex items-center container mx-auto max-w-screen-2xl h-full px-10">
			<div class="flex w-[30%]">
				<NuxtLink class="flex items-center space-x-1" to="/" >
					<img
						width="38"
						height="38"
						src="@/assets/logo.svg"
						alt="logo"
					/>

					<img
						class="w-64"
						src="@/assets/appy3.svg"
						alt="logo"
					/>
				</NuxtLink>
			</div>

			<nav class="flex items-center flex-shrink-0 space-x-8 w-[40%] h-full">
				<CategoriesList />
			</nav>

			<div class="flex justify-end items-center space-x-12 w-[30%] h-full">
				<UserNav />
				<CartIcon />
			</div>
		</section>
	</header>
</template>