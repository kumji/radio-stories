import { Heart, Sparkle } from './Decor'

// 제출 완료 후 보여주는 교환권. 캡처해서 임원단에게 보여주는 용도.
// 익명성 유지를 위해 제출 시각·번호 등 사연과 연결될 수 있는 정보는 넣지 않는다.
export function GiftVoucher() {
  return (
    <div className="mt-8">
      <div
        className="relative overflow-hidden rounded-3xl border-2 border-dashed border-love/50 bg-love-soft px-6 py-6 text-center shadow-soft"
        role="img"
        aria-label="선물 교환권. 캡쳐하셔서 임원단에게 보여주세요. 소정의 선물을 드립니다."
      >
        {/* 티켓 양옆 홈 */}
        <span className="absolute top-1/2 -left-4 h-8 w-8 -translate-y-1/2 rounded-full border-2 border-dashed border-love/50 bg-paper" aria-hidden="true" />
        <span className="absolute top-1/2 -right-4 h-8 w-8 -translate-y-1/2 rounded-full border-2 border-dashed border-love/50 bg-paper" aria-hidden="true" />
        <Sparkle className="absolute top-3 left-5 h-6 w-6 -rotate-12" />
        <Heart className="absolute top-4 right-6 h-5 w-5 rotate-12 text-love" filled />

        <p className="text-sm tracking-widest text-love">LET'S GO TOGETHER · 보이는 라디오</p>
        <p className="mt-2 text-5xl" aria-hidden="true">
          🎁
        </p>
        <p className="mt-2 font-title text-3xl text-ink">선물 교환권</p>

        <div className="my-4 border-t-2 border-dashed border-love/30" aria-hidden="true" />

        <p className="font-hand text-[1.35rem] leading-snug text-ink">
          캡쳐하셔서 임원단에게 보여주세요.
          <br />
          소정의 선물을 드립니다.
        </p>
      </div>
    </div>
  )
}
