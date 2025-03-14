import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      outDir: resolve(__dirname, 'dist/types'),
      include: ['src/**/*.ts', 'src/**/*.vue'],
      copyDtsFiles: true,
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '@/*': ['src/*']
        }
      },
      beforeWriteFile: (filePath, content) => {
        return {
          filePath: filePath,
          content: content
        }
      }
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueCameraKit',
      fileName: (format) => `vue-camera-kit.${format}.js`,
      formats: ['es', 'umd']
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      external: ['vue', '@vueuse/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@vueuse/core': 'VueUse'
        },
        assetFileNames: (assetInfo) => {
          return assetInfo.name === 'style.css' ? 'vue-camera-kit.css' : assetInfo.name || 'unknown'
        }
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8080,
    open: true,
    strictPort: false, // Allow fallback to another port if 8080 is in use
  },
  root: 'dev',
  publicDir: '../public',
})