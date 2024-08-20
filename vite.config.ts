import { defineConfig, loadEnv } from 'vite'
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";

installGlobals();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [remix({
    basename: "/",
    buildDirectory: "build",
    ignoredRouteFiles: ["**/*.css"],
  })],
  build: {
    target: 'esnext',
  },
  define: {
    'process.env': {...process.env, ...loadEnv(mode, process.cwd())},
  },
  server: {
    port: 5000,
    watch: {
      usePolling: true,
    },
  },
}))
