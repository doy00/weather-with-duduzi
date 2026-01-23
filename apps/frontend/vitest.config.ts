import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: [
        'src/features/**/services/**',
        'src/features/**/utils/**',
        'src/features/**/hooks/**',
        'src/lib/**',
      ],
      exclude: [
        '**/*.types.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/supabaseClient.ts',
        '**/tabSync.ts',
        '**/useSupabaseSync.ts',
        '**/useDebounce.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
