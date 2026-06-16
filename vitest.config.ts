import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['features/**/*.test.ts', 'hooks/**/*.test.ts'],
  },
})
