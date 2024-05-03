import { defineConfig } from 'vite'
import { resolve } from "node:path";
import { readdirSync } from "node:fs";
import react from '@vitejs/plugin-react';

const entryFullPath = resolve(__dirname, "src/entry");
const input: Record<string, string> = {
  index: resolve(__dirname, 'index.html'),
};
readdirSync(entryFullPath).map(fileName => {
  const name = fileName.split(".").slice(0, -1).join(".");
  input[name] = resolve(entryFullPath, fileName);
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0')
  },
  build: {
    rollupOptions: {
      input: input,
      external: [],
      output: {
        globals: {},
        entryFileNames: "scripts/[name].js"
      },
    },
    target: "es2020",
    minify: false
  },
})
