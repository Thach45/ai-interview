import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
  // Thêm rule về style code cho đẹp
  {
    rules: {
      // Quy tắc về khoảng trắng
      indent: ['error', 2],
      'space-before-blocks': 'error',
      'space-infix-ops': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],

      // Quy tắc về dấu chấm phẩy
      semi: ['error', 'always'],

      // Quy tắc về quotes (dùng dấu nháy đơn cho string)
      quotes: ['error', 'single'],

      // Quy tắc về tên biến, hàm (camelCase)
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase'] },
        { selector: 'function', format: ['camelCase'] },
        { selector: 'class', format: ['PascalCase'] },
        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
      ],

      // Quy tắc về react component (tên class phải viết hoa chữ cái đầu)
      'react/jsx-pascal-case': 'error',

      // Quy tắc về react hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
])
