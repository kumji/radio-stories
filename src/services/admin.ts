import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

// 가벼운 입장 확인용 비밀번호 (화면에서만 확인. 보안 장치는 아님)
const ADMIN_PIN = '3040'
const SESSION_KEY = 'radio-admin'

/** 같은 탭에서는 다시 묻지 않음 (탭 닫으면 초기화) */
export function isAdminSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function enterAdmin(pin: string): boolean {
  if (pin.trim() !== ADMIN_PIN) return false
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // 저장 실패해도 이번 화면에서는 입장
  }
  return true
}

export function exitAdmin(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // 무시
  }
}

const toDate = (t: unknown) => (t ? (t as Timestamp).toDate() : null)

export type StoryRow = { id: string; content: string; length: number; createdAt: Date | null }

export function watchStories(onData: (rows: StoryRow[]) => void, onError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'stories'), orderBy('createdAt', 'desc')),
    (snap) =>
      onData(
        snap.docs.map((d) => ({
          id: d.id,
          content: d.get('content') ?? '',
          length: d.get('length') ?? 0,
          createdAt: toDate(d.get('createdAt')),
        })),
      ),
    onError,
  )
}

export type CouponRow = { code: string; used: boolean; usedAt: Date | null }

// 쿠폰은 문서 ID(=쿠폰번호) 순으로만 보여준다. 발행 순서가 드러나면 사연과 짝지어질 수 있음.
export function watchCoupons(onData: (rows: CouponRow[]) => void, onError: (e: Error) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'coupons'),
    (snap) =>
      onData(
        snap.docs.map((d) => ({
          code: d.id,
          used: d.get('used') === true,
          usedAt: toDate(d.get('usedAt')),
        })),
      ),
    onError,
  )
}

export function setCouponUsed(code: string, used: boolean): Promise<void> {
  return updateDoc(doc(db, 'coupons', code), used ? { used: true, usedAt: serverTimestamp() } : { used: false, usedAt: deleteField() })
}
