import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import turboPlugin from 'eslint-plugin-turbo';
import sonarjs from 'eslint-plugin-sonarjs';
import onlyWarn from 'eslint-plugin-only-warn';

export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      import: pluginImport,
      'unused-imports': unusedImports,
      turbo: turboPlugin,
      sonarjs,
      'only-warn': onlyWarn,
    },
    rules: {
      'turbo/no-undeclared-env-vars': [
        'warn',
        { allowList: ['BASE_URL', 'MODE', 'DEV', 'PROD', 'SSR'] },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'sonarjs/cognitive-complexity': ['warn', 15],
    },
  },
  {
    ignores: ['**/dist/**', '**/build/**', '**/.next/**', 'node_modules/**'],
  },
];
