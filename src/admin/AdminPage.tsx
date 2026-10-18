import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { formatCouponCode, normalizeCouponCode } from '../lib/coupon'
import {
  enterAdmin,
  exitAdmin,
  isAdminSession,
  setCouponUsed,
  watchCoupons,
  watchStories,
  type CouponRow,
  type StoryRow,
} from '../services/admin'

type Tab = 'stories' | 'coupons'

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const LOAD_ERROR = '불러오지 못했어요. Firestore 규칙이 게시되었는지 확인해 주세요.'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(isAdminSession)

  return (
    <main className="mx-auto max-w-xl px-4 pt-6 pb-16 sm:px-5">
      <div className="flex min-h-11 items-center justify-between">
        <a href="#" className="flex min-h-11 items-center text-sm text-text/60 hover:text-love">
          ← 사연 접수 페이지
        </a>
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              exitAdmin()
              setIsAdmin(false)
            }}
            className="min-h-11 px-2 text-sm text-text/60 hover:text-love"
          >
            로그아웃
          </button>
        )}
      </div>
      <h1 className="mt-2 text-center font-title text-2xl text-ink">🎙️ 관리자메뉴</h1>

      {isAdmin ? <AdminTabs /> : <PinGate onEnter={() => setIsAdmin(true)} />}
    </main>
  )
}

function PinGate({ onEnter }: { onEnter: () => void }) {
  const [pin, setPin] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!pin) return
    if (enterAdmin(pin)) {
      onEnter()
      return
    }
    setPin('')
    setMessage('비밀번호가 맞지 않아요.')
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xs rounded-3xl bg-paper p-6 text-center shadow-soft">
      <label htmlFor="admin-pin" className="font-title text-lg text-ink">
        비밀번호를 입력해 주세요
      </label>
      <input
        id="admin-pin"
        type="password"
        inputMode="numeric"
        autoComplete="off"
        autoFocus
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="mt-4 h-14 w-full rounded-2xl border-2 border-love/20 bg-white text-center text-2xl tracking-[0.4em] focus:border-love focus:shadow-glow focus:outline-none"
      />
      <p className="mt-2 min-h-[1.8em] text-sm text-love" role="alert">
        {message}
      </p>
      <button
        type="submit"
        disabled={!pin}
        className="h-12 w-full rounded-full bg-love font-title text-lg text-white transition hover:brightness-105 disabled:opacity-40"
      >
        입장하기
      </button>
    </form>
  )
}

function AdminTabs() {
  const [tab, setTab] = useState<Tab>('stories')
  const tabs: { id: Tab; label: string }[] = [
    { id: 'stories', label: '📮 사연 모아보기' },
    { id: 'coupons', label: '☕ 쿠폰 사용확인' },
  ]

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-love-soft p-1" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-11 rounded-full font-title text-base transition ${
              tab === t.id ? 'bg-paper text-love shadow-soft' : 'text-text/70'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'stories' ? <StoriesTab /> : <CouponsTab />}
    </>
  )
}

function StoriesTab() {
  const [rows, setRows] = useState<StoryRow[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(
    () =>
      watchStories(setRows, (e) => {
        console.error(e)
        setError(true)
      }),
    [],
  )

  if (error) return <p className="mt-8 text-center text-love">{LOAD_ERROR}</p>
  if (!rows) return <p className="mt-8 text-center text-text/60">불러오는 중…</p>

  return (
    <section className="mt-6">
      <p className="text-sm text-text/70">총 {rows.length}개 · 최신순</p>
      {rows.length === 0 && <p className="mt-8 text-center text-text/60">아직 들어온 사연이 없어요.</p>}
      <ol className="mt-3 space-y-3">
        {rows.map((row, i) => (
          <li key={row.id} className="rounded-3xl bg-paper p-5 shadow-soft">
            <div className="flex items-center justify-between text-sm text-text/60">
              <span className="font-title text-base text-love">#{rows.length - i}</span>
              <span>
                {row.createdAt ? dateFormat.format(row.createdAt) : '저장 중'} · {row.length}자
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{row.content}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function CouponsTab() {
  const [rows, setRows] = useState<CouponRow[] | null>(null)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [pending, setPending] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  useEffect(
    () =>
      watchCoupons(setRows, (e) => {
        console.error(e)
        setError(true)
      }),
    [],
  )

  const keyword = normalizeCouponCode(search)
  const filtered = useMemo(
    () => (rows ?? []).filter((r) => r.code.includes(keyword)),
    [rows, keyword],
  )

  const toggle = async (code: string, used: boolean) => {
    setPending(code)
    setActionError('')
    try {
      await setCouponUsed(code, used)
    } catch (e) {
      console.error(e)
      setActionError('저장하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setPending(null)
    }
  }

  if (error) return <p className="mt-8 text-center text-love">{LOAD_ERROR}</p>
  if (!rows) return <p className="mt-8 text-center text-text/60">불러오는 중…</p>

  const usedCount = rows.filter((r) => r.used).length

  return (
    <section className="mt-6">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="쿠폰번호 검색 (예: ABC-DEF)"
        autoCapitalize="characters"
        autoComplete="off"
        className="h-12 w-full rounded-full border-2 border-love/20 bg-paper px-5 text-base uppercase placeholder:normal-case placeholder:text-text/40 focus:border-love focus:shadow-glow focus:outline-none"
      />
      <p className="mt-3 text-sm text-text/70">
        발행 {rows.length}장 · 사용 {usedCount}장 · 남음 {rows.length - usedCount}장
      </p>
      {actionError && (
        <p className="mt-2 text-sm text-love" role="alert">
          {actionError}
        </p>
      )}

      {keyword && filtered.length === 0 && (
        <p className="mt-6 rounded-2xl bg-love-soft px-4 py-3 text-center text-ink">
          발행되지 않은 쿠폰번호예요. 번호를 다시 확인해 주세요.
        </p>
      )}

      <ul className="mt-3 space-y-2">
        {filtered.map((row) => (
          <li
            key={row.code}
            className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-soft ${
              row.used ? 'bg-paper/60' : 'bg-paper'
            }`}
          >
            <div>
              <p className={`font-title text-xl tracking-wider ${row.used ? 'text-text/40 line-through' : 'text-ink'}`}>
                {formatCouponCode(row.code)}
              </p>
              {row.used && (
                <p className="text-xs text-text/60">
                  사용됨 {row.usedAt ? `· ${dateFormat.format(row.usedAt)}` : ''}
                </p>
              )}
            </div>
            {row.used ? (
              <button
                type="button"
                disabled={pending === row.code}
                onClick={() => toggle(row.code, false)}
                className="min-h-11 shrink-0 rounded-full px-3 text-sm text-text/60 underline-offset-2 hover:underline disabled:opacity-40"
              >
                사용 취소
              </button>
            ) : (
              <button
                type="button"
                disabled={pending === row.code}
                onClick={() => toggle(row.code, true)}
                className="min-h-11 shrink-0 rounded-full bg-love px-5 font-title text-base text-white transition hover:brightness-105 disabled:opacity-40"
              >
                사용 확인
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
