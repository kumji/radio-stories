import { useEffect, useRef } from 'react'
import { Heart, Sparkle } from './Decor'
import { GiftVoucher } from './GiftVoucher'

const FLOATING = [
  { left: '18%', delay: '0s', size: 'h-6 w-6' },
  { left: '34%', delay: '0.25s', size: 'h-4 w-4' },
  { left: '50%', delay: '0.1s', size: 'h-8 w-8' },
  { left: '66%', delay: '0.35s', size: 'h-5 w-5' },
  { left: '80%', delay: '0.15s', size: 'h-4 w-4' },
]

export function SuccessView({ couponCode, onReset }: { couponCode: string; onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="relative mt-4 overflow-hidden rounded-3xl bg-paper px-6 pt-16 pb-10 text-center shadow-soft">
      <div className="pointer-events-none absolute inset-x-0 top-40 h-0" aria-hidden="true">
        {FLOATING.map((h, i) => (
          <span key={i} className="float-heart absolute text-love" style={{ left: h.left, animationDelay: h.delay }}>
            <Heart className={h.size} filled />
          </span>
        ))}
      </div>

      <Sparkle className="absolute top-5 right-6 h-7 w-7 rotate-12" />
      <h2 ref={headingRef} tabIndex={-1} className="font-title text-2xl text-ink outline-none">
        사연이 잘 전달되었어요 💛
      </h2>
      <p className="mt-3">소중한 이야기 들려주셔서 감사합니다.</p>
      <p className="mt-6 font-title text-xl text-love">LET'S GO TOGETHER</p>

      <GiftVoucher code={couponCode} />

      <button
        type="button"
        onClick={onReset}
        className="mt-8 min-h-12 rounded-full border-2 border-love/40 bg-paper px-6 font-title text-lg text-love transition hover:bg-love-soft focus-visible:ring-4 focus-visible:ring-love/20 focus-visible:outline-none"
      >
        사연 하나 더 보내기
      </button>
    </div>
  )
}
