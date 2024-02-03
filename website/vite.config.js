import { defineConfig } from 'vite'
import vitePluginImp from 'vite-plugin-imp';
import react from '@vitejs/plugin-react-swc';
import styleX from "vite-plugin-stylex";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true
  },
  plugins: [
    react(),
    styleX()
  ]
})
