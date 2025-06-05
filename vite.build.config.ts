import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'MyLib', // Your library name
      fileName: (format) => `my-lib.${format}.js`,
      formats: ['es', 'cjs'], // Output formats
    },
    rollupOptions: {
      // Make sure to externalize dependencies you do not want to bundle into your library
      external: ['react', 'react-dom', 'remark-gfm', 'react-markdown', 'highlight.js'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
