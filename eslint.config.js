import js from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    settings: {
      'import/extensions': ['.js', '.jsx', 'ts', 'tsx'],
      'import/resolver': { typescript: true, node: true },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',

      // Ignore virtual modules when resolving
      'import/no-unresolved': ['error', { ignore: ['virtual:.*'] }],

      // Import sorting
      'import/order': 'off', // must be off for simple-import-sort to work
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off', // must be off for simple-import-sort to work
    },
  },
]);
