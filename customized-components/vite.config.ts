// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "customized",
      filename: "remoteEntry.js",
      exposes: {
        // Expose components by user ID - LLMs will need to synchronize commits to this correctly
        // Might require better infrastructure than just git to maintain this
        "./user-id-1-header": "./src/user-id-1/header.tsx",
        "./user-id-2-header": "./src/user-id-2/header.tsx",
      },
      shared: ["react", "react-dom"],
      // Add these options for better ES module support
      remotes: {},
      // This is important for fixing the import.meta error
      transformFileTypes: [".js", ".mjs", ".ts", ".jsx", ".tsx", ".json"],
    }),
  ],
  server: {
    port: 3001,
    // Add this to help with module imports
    fs: {
      strict: false,
    },
  },
  build: {
    target: "esnext", // This is crucial for top-level await
    minify: false,
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        format: "esm", // Ensure we're using ES modules
      },
    },
  },
});
