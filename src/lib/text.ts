export const MAX_LENGTH = 500

/** 이모지 1개 = 1자 (코드 포인트 단위) */
export function countChars(text: string): number {
  return Array.from(text).length
}

export function clampChars(text: string, max = MAX_LENGTH): string {
  const chars = Array.from(text)
  return chars.length > max ? chars.slice(0, max).join('') : text
}
