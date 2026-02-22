import js from '@eslint/js';
import jynxio from '@jynxio/eslint-plugin';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import typescript from 'typescript-eslint';

const underscoreWrapper = {
    plugins: { jynxio },
    rules: {
        'jynxio/underscore-file-pattern': [
            'error',
            { '$': path.resolve('./'), '@': path.resolve('./src') },
        ],
    },
};

export default defineConfig([
    { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,d.ts}'] },
    { ignores: ['**/dist/**', '**/out/**', '**/build/**', '**/node_modules/**'] },
    { languageOptions: { globals: { ...globals.browser, ...globals.node, chrome: 'readonly' } } },

    underscoreWrapper,
    js.configs.recommended,
    ...typescript.configs.recommended,
    prettier,

    {
        rules: {
            'no-unused-expressions': 'off',

            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
]);
