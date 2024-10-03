import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the `mode` and current directory
  const env = loadEnv(mode, resolve(__dirname, '../'));

  return {
    plugins: [react()],
    server: {
      https: false,  // Ensure HTTPS is disabled
      port: 5173,    // Optional: specify the port if you want to use a different one
      host: 'localhost', // Optional: specify the host, e.g., 'localhost'
    },
    // Additional config using `env`
    // ... other configurations if needed
  };
});
