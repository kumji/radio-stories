import { useEffect, useRef } from 'react'

type Props = {
  open: boolean
  submitting: boolean
  onCancel: () => void
  onConfirm: () => void
}

// window.confirm 대신 쓰는 커스텀 모달 (카톡 인앱 브라우저 대응)
export function ConfirmModal({ open, submitting, onCancel, onConfirm }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!submitting) onCancel()
        return
      }
      // 두 버튼 사이에서만 포커스 순환
      if (e.key === 'Tab') {
        const targets = [cancelRef.current, confirmRef.current].filter(
          (el): el is HTMLButtonElement => !!el && !el.disabled,
        )
        if (targets.length === 0) return
        const idx = targets.indexOf(document.activeElement as HTMLButtonElement)
        const next = e.shiftKey ? idx - 1 : idx + 1
        e.preventDefault()
        targets[(next + targets.length) % targets.length].focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, submitting, onCancel])

  if (!open) return null

  return (
    <div
      className="anim-fade-in fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: 'rgba(74, 63, 58, 0.4)' }}
      onClick={() => !submitting && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="anim-pop-in w-full max-w-sm overflow-hidden rounded-3xl bg-paper shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center bg-love-soft py-5 text-5xl" aria-hidden="true">
          💌
        </div>
        <div className="px-6 pt-5 pb-6 text-center">
          <h2 id="confirm-title" className="font-title text-2xl text-ink">
            사연을 제출할까요?
          </h2>
          <p id="confirm-desc" className="mt-2">
            한 번 제출하면 수정하거나 취소하기 어렵습니다. 정말 제출하시겠어요?
          </p>
          <div className="mt-6 flex gap-3">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="min-h-12 flex-1 rounded-full border-2 border-love/30 bg-paper px-4 font-title text-lg text-text transition hover:border-love/60 focus-visible:ring-4 focus-visible:ring-love/20 focus-visible:outline-none disabled:opacity-50"
            >
              다시 볼게요
            </button>
            <button
              ref={confirmRef}
              type="button"
              onClick={onConfirm}
              disabled={submitting}
              aria-busy={submitting}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-love px-4 font-title text-lg text-white transition hover:brightness-105 focus-visible:ring-4 focus-visible:ring-love/30 focus-visible:outline-none disabled:opacity-80"
            >
              {submitting ? (
                <>
                  <span className="spinner h-4 w-4 rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                  보내는 중…
                </>
              ) : (
                '제출하기'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
