import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import styleX from "vite-plugin-stylex";
import { promises as fs } from 'fs';

// https://vitejs.dev/config/

/**
 * Library Mode
 * https://vitejs.dev/guide/build.html#library-mode
 */

const outputBasePath = './../public';
const outputFilePath = 'scripts/ui.js';

export default defineConfig({
  plugins: [
    react(),
    styleX(),
    {
      closeBundle: async() => {
        // Hack Ant.Design v5 Performance Issues
        // Using Tables causes very slow interactions on the entire page because an infinite loop executes the scrollTo function.
        const bundlePath = `${outputBasePath}/${outputFilePath}`
        let data = await fs.readFile(bundlePath, 'utf-8');
        data = data.replace('function scrollTo(', 'function $_scrollTo_antd_bug_$(');
        await fs.writeFile(bundlePath, data, 'utf-8');
      }
    }
  ],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      input: 'src/index.jsx',
      output: {
        dir: outputBasePath,
        entryFileNames: outputFilePath,
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `images/[name][extname]`;
          } else if (/css/i.test(extType)) {
            return `styles/ui[extname]`;
          } else {
            return `[name][extname]`;
          }
        },
        chunkFileNames: "ui-chunk.js",
        manualChunks: undefined,
      },
      onwarn: (warning, warn) => {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || warning.code == 'EVAL') {
          return;
        }
        warn(warning);
      }
    }
  }
})
