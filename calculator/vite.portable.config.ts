// Produces a single, self-contained HTML file (JS + CSS inlined) so the
// calculator can be opened directly by double-clicking — no dev server,
// no `npm install` required. Used only for one-off portable exports; the
// normal `npm run build` (vite.config.ts) still code-splits for real
// hosting.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-portable',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
})
