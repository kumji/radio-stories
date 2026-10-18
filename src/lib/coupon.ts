// 쿠폰번호: 사연과 무관한 랜덤 6자리. 헷갈리는 글자(0/O, 1/I/L)는 제외.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const COUPON_LENGTH = 6

export function generateCouponCode(): string {
  const bytes = new Uint8Array(COUPON_LENGTH)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
}

/** 화면 표시용: ABC-DEF */
export function formatCouponCode(code: string): string {
  return `${code.slice(0, 3)}-${code.slice(3)}`
}

/** 검색 입력 정규화: 소문자·하이픈·공백 허용 */
export function normalizeCouponCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '')
}
