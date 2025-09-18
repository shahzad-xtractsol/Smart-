import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY)
      },
      resolve: {
        alias: {
          // FIX: `__dirname` is not available in all module systems. `path.resolve('.')`
          // resolves to the current working directory, which is the project root when
          // running Vite.
          '@': path.resolve('.'),
        }
      }
    };
});