// 임시저장. 인앱 브라우저에서 localStorage 접근이 실패할 수 있어 전부 try/catch.
const DRAFT_KEY = 'radio-draft'

export function loadDraft(): string {
  try {
    return localStorage.getItem(DRAFT_KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveDraft(text: string): void {
  try {
    if (text) localStorage.setItem(DRAFT_KEY, text)
    else localStorage.removeItem(DRAFT_KEY)
  } catch {
    // 저장 실패는 무시
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    // 무시
  }
}
