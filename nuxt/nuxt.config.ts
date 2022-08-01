import { defineNuxtConfig } from 'nuxt'
import eslintPlugin from 'vite-plugin-eslint'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	modules: ['nuxt-windicss', '@nuxtjs/strapi'],

	css: ['@/assets/main.css'],

	vite: {
		plugins: [eslintPlugin()],
	},
})
