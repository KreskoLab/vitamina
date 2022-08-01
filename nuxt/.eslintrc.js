module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'prettier',
		'eslint:recommended',
		'plugin:vue/essential',
		'plugin:@typescript-eslint/recommended',
		'@nuxtjs/eslint-config-typescript'
	],
	parser: 'vue-eslint-parser',
	parserOptions: { parser: '@typescript-eslint/parser', },
	plugins: ['vue', '@typescript-eslint'],
	rules: {
		'vue/no-unused-vars': 'error',
		indent: 'off',
		'no-tabs': ['error', { allowIndentationTabs: true, }],
		'vue/html-indent': ['error', 'tab'],
		'@typescript-eslint/indent': ['error', 'tab'],
		'vue/html-self-closing': 0,
		'vue/multi-word-component-names': 'off',
		semi: 0,
		'comma-dangle': ['error', {
			arrays: 'never',
			objects: 'always',
			imports: 'never',
			exports: 'never',
			functions: 'never',
		}],
	},
}
