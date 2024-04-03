import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'build', // Set the build output directory to 'build'
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
});
