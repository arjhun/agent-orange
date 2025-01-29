import { defineConfig } from "vite";
import { resolve } from "node:path";
import zipPack from "vite-plugin-zip-pack";

const version = process.env.npm_package_version;

export default defineConfig({
  plugins: [zipPack({ outFileName: `trumper-dumper_${version}.zip` })],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "js/[name].js",
        assetFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
      },
      input: {
        background: resolve(__dirname, "src/background/background.js"),
        main: resolve(__dirname, "./option_popup.html"),
        content: resolve(__dirname, "src/content/content.js"),
        content_loader: resolve(__dirname, "src/content/content_loader.js"),
      },
    },
  },
});
