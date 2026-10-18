import { MAX_LENGTH, countChars } from '../lib/text'

const TIMEOUT_MS = 20_000

function loadFirestore() {
  return Promise.all([import('../lib/firebase'), import('firebase/firestore')])
}

/** 입력을 시작할 때 SDK를 미리 받아둬 제출을 빠르게 */
export function preloadStories(): void {
  loadFirestore().catch(() => {})
}

/**
 * 사연 저장. 식별 정보(userAgent, IP, uid 등)는 절대 추가하지 말 것.
 * Firebase SDK는 첫 제출 시점에 불러와 첫 화면 로딩을 가볍게 유지한다.
 */
export async function submitStory(content: string): Promise<void> {
  const trimmed = content.trim()
  const length = countChars(trimmed)
  if (length === 0) throw new Error('empty')
  if (length > MAX_LENGTH) throw new Error('too-long')

  // 오프라인이면 Firestore가 쓰기를 큐에 쌓고 promise가 끝나지 않으므로 미리 차단
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('offline')
  }

  const [{ db }, { addDoc, collection, serverTimestamp }] = await loadFirestore()

  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
  })

  try {
    await Promise.race([
      addDoc(collection(db, 'stories'), {
        content: trimmed,
        createdAt: serverTimestamp(),
        length,
      }),
      timeout,
    ])
  } finally {
    clearTimeout(timer)
  }
}
