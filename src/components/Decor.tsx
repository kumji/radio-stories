// 포스터의 손그림 하트·반짝이. 이미지 대신 인라인 SVG.

type DecorProps = { className?: string }

export function Heart({ className = '', filled = false }: DecorProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 20.5c-.4-.3-7.4-4.7-9.1-9.3C1.6 7.8 3.6 4.4 7 4.2c2.1-.1 3.8 1.1 5 2.9 1.3-1.9 3-3.1 5.2-2.9 3.3.3 5.1 3.7 3.8 7-1.8 4.6-8.6 9-9 9.3z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 노란 짧은 선 3개짜리 반짝이 */
export function Sparkle({ className = '' }: DecorProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g stroke="var(--sun)" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M12 3.5v5" />
        <path d="M4.5 9.5l3.6 2.4" />
        <path d="M19.5 9.5l-3.6 2.4" />
      </g>
    </svg>
  )
}

/** 손그림 느낌 밑줄 */
export function Squiggle({ className = '' }: DecorProps) {
  return (
    <svg viewBox="0 0 220 16" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M4 10c22-6 40 4 62-1s38-6 58-1 40 5 60 0 24-3 32-2"
        fill="none"
        stroke="var(--love)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function HeartDivider() {
  return (
    <div className="flex justify-center gap-3 py-5 text-love/60 select-none" aria-hidden="true">
      <span>♡</span>
      <span>♡</span>
      <span>♡</span>
    </div>
  )
}
