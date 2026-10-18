# 보이는 라디오 익명 사연 접수

2026 광림교회 청장2부 **LET'S GO FESTIVAL – 보이는 라디오** 사연을 익명으로 받는 원페이지 웹앱입니다.
이름·연락처·기기정보는 수집하지 않으며, 운영진은 관리자메뉴(또는 Firebase Console)에서 사연을 열람합니다.
제출하면 사연과 무관한 랜덤 번호의 **선물 교환권**이 발행됩니다.

- Vite + React + TypeScript + Tailwind CSS
- Firebase Firestore
- GitHub Pages + GitHub Actions 배포

---

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # Firebase 설정값 채우기 (아래 2단계 참고)
npm run dev
```

---

## 처음 세팅하기

### 1. Firebase 프로젝트 만들기
1. [Firebase Console](https://console.firebase.google.com) → **프로젝트 추가** (Google 애널리틱스는 꺼도 됩니다)
2. 왼쪽 메뉴 **빌드 → Firestore Database → 데이터베이스 만들기**
   - 위치: **`asia-northeast3` (서울)**
   - **프로덕션 모드**로 시작

### 2. 웹앱 등록 & 설정값 복사
1. 프로젝트 개요 옆 ⚙️ → **프로젝트 설정 → 일반 → 내 앱 → 웹(</>)** 추가
2. 앱 닉네임 입력 (Firebase Hosting은 체크하지 않음)
3. 화면에 나오는 `firebaseConfig` 값 6개를 `.env.local`에 옮겨 적기

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> `.env.local`은 `.gitignore`에 포함되어 있어 커밋되지 않습니다.

### 3. Firestore 보안 규칙 게시
1. Console → **Firestore Database → 규칙** 탭
2. 이 레포의 [`firestore.rules`](./firestore.rules) 내용을 전부 붙여넣기 → **게시**

이 규칙은 사연·쿠폰 생성 시 필드와 길이를 검증하고, 사연 수정·삭제를 막습니다.
관리자메뉴를 위해 **읽기와 쿠폰 사용 처리는 열려 있습니다.** 관리자 비밀번호는 화면에서만 확인하는 가벼운 장치라,
Firebase SDK를 직접 다룰 줄 아는 사람은 비밀번호 없이도 사연을 읽을 수 있습니다.

### 4. GitHub 레포 & Secrets
1. GitHub에 **public** 레포 생성 (무료 계정 Pages 조건). 레포 이름이 `radio-stories`가 아니면 [`vite.config.ts`](./vite.config.ts)의 `base`를 `/<레포이름>/`으로 바꿔주세요.
2. 레포 **Settings → Secrets and variables → Actions → New repository secret** 으로 아래 6개 등록 (값은 2단계와 동일)
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 5. GitHub Pages 설정
1. 레포 **Settings → Pages → Build and deployment → Source: `GitHub Actions`**
2. `main` 브랜치에 push하면 자동으로 빌드·배포됩니다. (Actions 탭에서 진행 상황 확인)
3. 배포 주소: `https://<GitHub아이디>.github.io/<레포이름>/`

---

## 관리자메뉴 (운영진)
메인 페이지 우측 상단 **관리자메뉴** (또는 `<배포주소>/#/admin`) → 비밀번호 입력 (`src/services/admin.ts`의 `ADMIN_PIN`)
- **📮 사연 모아보기**: 들어온 사연 전체를 최신순으로 표시 (실시간 갱신)
- **🎁 쿠폰 사용확인**: 교환권 캡처의 쿠폰번호를 검색 → **사용 확인**. 잘못 눌렀으면 **사용 취소**
  - 검색 결과가 없으면 발행되지 않은 번호입니다.
  - 쿠폰 목록은 번호순으로만 보여줍니다. 발행 순서·시각을 저장하지 않아 쿠폰과 사연을 짝지을 수 없습니다.
- 같은 탭에서는 비밀번호를 다시 묻지 않고, 탭(브라우저)을 닫으면 다시 입력해야 합니다.

## Firebase Console에서 사연 열람
1. [Firebase Console](https://console.firebase.google.com) → 프로젝트 선택
2. **Firestore Database → 데이터** 탭 → `stories` 컬렉션
3. 각 문서의 필드
   - `content`: 사연 본문
   - `createdAt`: 제출 시각
   - `length`: 글자 수
4. 시간순 정렬: 컬렉션 상단 **필터(≡) → `createdAt` 기준 정렬**

> Console은 관리자 권한으로 접근하므로 보안 규칙(읽기 차단)의 영향을 받지 않습니다.

---

## 배포 전 확인
- [ ] 카카오톡 인앱 브라우저(iOS/Android)에서 열기·입력·제출
- [ ] 정확히 500자(이모지 섞어서) 제출 성공, 501자 이상은 입력 자체가 안 됨
- [ ] 600자 초과 글을 콘솔에서 직접 `addDoc` 시도 시 규칙에서 거부
- [ ] 첫 화면 인상이 포스터와 이어지는지 (색·폰트·하트) 폰에서 확인
- [ ] 제출 버튼 연타해도 문서 1개만 생성
- [ ] 새로고침 시 임시저장 복원, 제출 후엔 비워짐
