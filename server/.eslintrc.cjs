module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended'
    ],
    rules: {
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    },
    settings: { react: { version: 'detect' } }
}
