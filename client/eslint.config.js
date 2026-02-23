import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/** Vitest globals provided when `globals: true` is set in vite.config.ts */
const vitestGlobals = {
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  vi: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
}

export default defineConfig([
  globalIgnores(['dist']),

  // ── Source files ──────────────────────────────────────────────────────────
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', 'src/__tests__/**'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },

  // ── Test files — all vitest globals are available; imports are optional style ──
  {
    files: ['**/*.test.{ts,tsx}', 'src/__tests__/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...vitestGlobals,
      },
    },
    rules: {
      // Explicit vitest imports (vi.fn, describe, etc.) are fine even when globals are enabled
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      }],
    },
  },
])
