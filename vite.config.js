import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    // 1. imagetools plugin for getOptimizedImage-function
    imagetools(),

    // 2. ViteImageOptimizer for optimization of all formats
    ViteImageOptimizer({
      avif: { quality: 60 },
      webp: { quality: 70 },
      jpeg: { quality: 75 },
      jpg: { quality: 75 },
      png: { 
        quality: 50,
        palette: true,
      },
      svg: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'sortAttrs', active: true }
        ],
      },
      cache: true,
      cacheLocation: './node_modules/.cache/vite-plugin-image-optimizer',
    }),
  ]
})