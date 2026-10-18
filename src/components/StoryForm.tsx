import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ChangeEvent } from 'react'
import { clearDraft, loadDraft, saveDraft } from '../lib/draft'
import { MAX_LENGTH, clampChars, countChars } from '../lib/text'
import { preloadStories, submitStory } from '../services/stories'
import { ConfirmModal } from './ConfirmModal'
import { Heart, Sparkle } from './Decor'
import { SuccessView } from './SuccessView'

type Status = 'editing' | 'confirming' | 'submitting' | 'done'

const PLACEHOLDER = '여기에 사연을 적어주세요. 사연 제목이 있다면 첫 줄에 적어주셔도 좋아요. (익명으로 전달됩니다)'

export function StoryForm() {
  const [text, setText] = useState(() => clampChars(loadDraft()))
  const [status, setStatus] = useState<Status>('editing')
  const [error, setError] = useState(false)
  const [overLimit, setOverLimit] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const composingRef = useRef(false)
  const inFlightRef = useRef(false)
  const overLimitTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // 임시저장 (500ms 디바운스)
  useEffect(() => {
    if (status === 'done') return
    const t = setTimeout(() => saveDraft(text), 500)
    return () => clearTimeout(t)
  }, [text, status])

  // 내용에 맞춰 높이 자동 조절
  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text, status])

  useEffect(() => () => clearTimeout(overLimitTimer.current), [])

  const flashOverLimit = () => {
    setOverLimit(true)
    clearTimeout(overLimitTimer.current)
    overLimitTimer.current = setTimeout(() => setOverLimit(false), 2500)
  }

  const applyLimit = (value: string) => {
    if (countChars(value) > MAX_LENGTH) {
      flashOverLimit()
      return clampChars(value)
    }
    return value
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    // 한글 조합 중에 자르면 글자가 깨질 수 있어 조합이 끝난 뒤 자름
    setText(composingRef.current ? value : applyLimit(value))
    if (error) setError(false)
  }

  const handleCompositionEnd = (value: string) => {
    composingRef.current = false
    setText(applyLimit(value))
  }

  const handleConfirm = useCallback(async () => {
    if (inFlightRef.current) return // 중복 제출 방지
    inFlightRef.current = true
    setStatus('submitting')
    setError(false)
    try {
      await submitStory(clampChars(text))
      clearDraft()
      setText('')
      setStatus('done')
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      console.error(err)
      setError(true)
      setStatus('editing')
    } finally {
      inFlightRef.current = false
    }
  }, [text])

  const handleCancel = useCallback(() => setStatus('editing'), [])

  const handleReset = () => {
    setText('')
    setStatus('editing')
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  const length = Math.min(countChars(text), MAX_LENGTH)
  const isEmpty = text.trim().length === 0
  const counterClass =
    length >= MAX_LENGTH ? 'text-love font-bold' : length >= 450 ? 'text-love' : 'text-text/45'

  return (
    <section ref={sectionRef} aria-labelledby="story-heading" className="relative mt-12 scroll-mt-6">
      <Sparkle className="absolute -top-3 right-2 h-7 w-7 rotate-6" />
      <h2 id="story-heading" className="text-center font-title text-2xl text-ink">
        💌 여러분의 이야기를 들려주세요
      </h2>

      {status === 'done' ? (
        <SuccessView onReset={handleReset} />
      ) : (
        <>
          <p className="mt-4 rounded-2xl bg-love-soft/70 px-4 py-3 text-[0.95rem] leading-relaxed">
            🔒 이름이나 연락처는 수집하지 않습니다. 본문에 직접 적지 않는 한 누가 썼는지 알 수 없어요.
          </p>

          <div className="relative mt-4">
            <label htmlFor="story" className="sr-only">
              사연 입력
            </label>
            <textarea
              id="story"
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onFocus={preloadStories}
              onCompositionStart={() => (composingRef.current = true)}
              onCompositionEnd={(e) => handleCompositionEnd(e.currentTarget.value)}
              placeholder={PLACEHOLDER}
              rows={6}
              aria-describedby="story-counter"
              className="letter-paper block min-h-[12rem] w-full resize-none overflow-hidden rounded-3xl border-2 border-love/15 px-5 pt-4 pb-10 text-[17px] text-text shadow-soft transition-[border-color,box-shadow] duration-200 placeholder:text-text/40 focus:border-love focus:shadow-glow focus:outline-none"
            />
            <span
              id="story-counter"
              className={`pointer-events-none absolute right-5 bottom-3 text-sm tabular-nums ${counterClass}`}
              aria-live="polite"
            >
              {length} / {MAX_LENGTH}
            </span>
          </div>

          <p className="mt-2 min-h-[1.8em] text-center text-sm text-love" role="status">
            {overLimit && '500자까지만 담을 수 있어요 🙏'}
          </p>

          {error && (
            <p className="mb-3 rounded-2xl bg-love-soft px-4 py-3 text-center text-[0.95rem] text-ink" role="alert">
              전송에 실패했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.
            </p>
          )}

          <button
            type="button"
            onClick={() => setStatus('confirming')}
            disabled={isEmpty || status === 'submitting'}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-love font-title text-xl text-white shadow-soft transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-love/30 focus-visible:outline-none active:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            <Heart className="heart-bounce h-5 w-5" filled />
            제출하기
          </button>
        </>
      )}

      <ConfirmModal
        open={status === 'confirming' || status === 'submitting'}
        submitting={status === 'submitting'}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </section>
  )
}
