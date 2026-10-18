import { formatCouponCode } from '../lib/coupon'
import { Heart, Sparkle } from './Decor'

// 제출 완료 후 보여주는 청장 커피 쿠폰. 캡처해서 임원단에게 보여주는 용도.
// 쿠폰번호는 사연과 무관한 랜덤 값. 제출 시각 등 사연과 연결될 수 있는 정보는 넣지 않는다.
export function GiftVoucher({ code }: { code: string }) {
  const formatted = formatCouponCode(code)
  return (
    <div className="mt-8">
      <div
        className="relative overflow-hidden rounded-3xl border-2 border-dashed border-love/50 bg-love-soft px-6 py-6 text-center shadow-soft"
        role="img"
        aria-label={`청장 커피 쿠폰. 쿠폰번호 ${formatted}. 캡쳐하셔서 임원단에게 보여주세요.`}
      >
        {/* 티켓 양옆 홈 */}
        <span className="absolute top-1/2 -left-4 h-8 w-8 -translate-y-1/2 rounded-full border-2 border-dashed border-love/50 bg-paper" aria-hidden="true" />
        <span className="absolute top-1/2 -right-4 h-8 w-8 -translate-y-1/2 rounded-full border-2 border-dashed border-love/50 bg-paper" aria-hidden="true" />
        <Sparkle className="absolute top-3 left-5 h-6 w-6 -rotate-12" />
        <Heart className="absolute top-4 right-6 h-5 w-5 rotate-12 text-love" filled />

        <p className="text-sm tracking-widest text-love">LET'S GO TOGETHER · 보이는 라디오</p>
        <p className="mt-2 text-5xl" aria-hidden="true">
          ☕
        </p>
        <p className="mt-2 font-title text-3xl text-ink">청장 커피 쿠폰</p>

        <div className="mt-4 inline-block rounded-2xl bg-paper px-5 py-2">
          <p className="text-xs text-text/60">쿠폰번호</p>
          <p className="font-title text-3xl tracking-[0.15em] text-love tabular-nums">{formatted}</p>
        </div>

        <div className="my-4 border-t-2 border-dashed border-love/30" aria-hidden="true" />

        <p className="font-hand text-[1.35rem] leading-snug text-ink">캡쳐하셔서 임원단에게 보여주세요.</p>
      </div>
    </div>
  )
}
