import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { remixDevTools } from "remix-development-tools";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [
		remixDevTools(),
		remix({
			buildDirectory: "build",
			serverModuleFormat: "esm",
			ignoredRouteFiles: ["**/.*", "**/*.css"],
			routes: async (defineRoutes) => {
				return flatRoutes("routes", defineRoutes);
			},
		}),
		tsconfigPaths(),
	],
	build: {
		target: "esnext",
	},
	define: {
		"process.env": { ...process.env, ...loadEnv(mode, process.cwd()) },
	},
	server: {
		port: 5000,
		watch: {
			usePolling: true,
		},
	},
}));
