import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Bimestre_09_DFII_Exp1_S3_FranciscoHenriquez/',
  plugins: [react(), tailwindcss()],
})