import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  server: {
    https: false,  // Disable HTTPS, ensure it is set to false
  },
  // Load environment variables based on the `mode` and current directory
  const env = loadEnv(mode, resolve(__dirname, '../'));

  return {
    plugins: [react()],
    // Additional config using `env`
  };
});