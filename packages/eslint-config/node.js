import { config as baseConfig } from './base.js';
import pluginNode from 'eslint-plugin-node';
import security from 'eslint-plugin-security';

export const config = [
  ...baseConfig,
  {
    plugins: { node: pluginNode, security },
    rules: {
      'node/no-unsupported-features/es-syntax': 'off',
      'security/detect-object-injection': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
];
