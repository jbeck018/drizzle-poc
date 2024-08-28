import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from "@vitejs/plugin-react";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { installGlobals } from '@remix-run/node';

installGlobals();
export default defineConfig(({ mode }) => {
  return {
    // no Remix Vite plugin here
    plugins: [
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
        }
      }),
      react(),
      tsconfigPaths()
    ],
    define: {
      "process.env": { ...process.env, ...loadEnv(mode, process.cwd()) },
    },
  }
})