import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                define: 'readonly',
                console: 'readonly',
            },
        },
        rules: {
            curly: 'error',
            eqeqeq: 'error',
            'wrap-iife': ['error', 'any'],
            'no-use-before-define': ['off'],
            'new-cap': 'error',
            'no-caller': 'error',
            'dot-notation': 'off',
            'no-undef': 'error',
            'no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_', // allow catch (_e) {}
                    ignoreRestSiblings: true,
                },
            ],
            'no-cond-assign': ['error', 'except-parens'],
            'no-eq-null': 'error',
        },
    },
])
