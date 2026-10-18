import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 하위 경로 = 레포 이름. 레포 이름이 바뀌면 여기만 수정.
export default defineConfig({
  base: '/radio-stories/',
  plugins: [react(), tailwindcss()],
  // Firestore SDK 청크(~600KB)는 제출 시점에만 지연 로딩되므로 경고 기준을 올림
  build: { chunkSizeWarningLimit: 700 },
})
