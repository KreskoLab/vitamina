import { defineNuxtConfig } from 'nuxt'
import UnpluginComponentsVite from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	modules: ['nuxt-windicss', '@nuxtjs/strapi', 'unplugin-icons/nuxt', '@vueuse/nuxt'],

	css: ['@/assets/main.css'],

	strapi: {
		url: process.env.STRAPI_URL || 'http://localhost:1337'
	},

	vite: {
		plugins: [
			UnpluginComponentsVite({
				dts: false,
				resolvers: [
					IconsResolver({
						prefix: 'Icon',
					}),
				],
			}),
		],
	},
})
