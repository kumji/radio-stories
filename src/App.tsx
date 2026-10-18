import { lazy, Suspense, useEffect, useState } from 'react'
import { Intro } from './components/Intro'
import { StoryForm } from './components/StoryForm'

// 관리자 화면은 별도 청크로 분리 (일반 방문자는 내려받지 않음)
const AdminPage = lazy(() => import('./admin/AdminPage'))

// GitHub Pages는 하위 경로 라우팅을 지원하지 않아 해시(#/admin)로 구분
const isAdminHash = () => window.location.hash === '#/admin'

export default function App() {
  const [admin, setAdmin] = useState(isAdminHash)

  useEffect(() => {
    const onHashChange = () => {
      setAdmin(isAdminHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (admin) {
    return (
      <Suspense fallback={<p className="mt-16 text-center text-text/60">불러오는 중…</p>}>
        <AdminPage />
      </Suspense>
    )
  }

  return (
    <main className="relative mx-auto max-w-xl px-4 pt-4 pb-16 sm:px-5">
      <a
        href="#/admin"
        className="absolute top-2 right-3 z-10 flex min-h-11 items-center px-2 text-sm text-text/50 hover:text-love"
      >
        관리자메뉴
      </a>
      <Intro />
      <StoryForm />
    </main>
  )
}
