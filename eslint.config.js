// eslint.config.js
module.exports = [{
    languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'commonjs',
        globals: {
            node: true,
            jest: true,
            process: true,
            console: true,
            module: true,
            require: true,
            describe: true,
            it: true,
            expect: true,
            afterAll: true
        }
    },
    plugins: {
        node: require('eslint-plugin-node'),
        import: require('eslint-plugin-import')
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-console': 'off',
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always']
    }
}];