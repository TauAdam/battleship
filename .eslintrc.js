module.exports = {
	env: {
		es2021: true,
		jest: true,
		node: true,
	},
	extends: ['plugin:prettier/recommended', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {},
}
