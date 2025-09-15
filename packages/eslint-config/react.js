import { config as baseConfig } from './base.js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export const config = [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...pluginReactHooks.configs['recommended-latest'].rules,
      ...pluginReactRefresh.configs.vite.rules,
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': 'warn',
    },
  },
];
