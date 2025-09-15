# ⛳ 실시간 골프 예약 웹 애플리케이션

## 📖 프로젝트 소개

용자가 전국의 골프장을 실시간으로 검색하고, 원하는 티타임을 간편하게 예약할 수 있는 웹 애플리케이션입니다. React, Vite, TypeScript를 기반으로 구축되었으며, 모던 웹 개발 기술 스택을 활용하여 빠르고 안정적인 사용자 경험을 제공하는 것을 목표로 합니다.

## ✨ 주요 기능

- **실시간 골프장 조회**: 날짜별로 예약 가능한 골프장 목록을 실시간으로 조회합니다.
- **상세 필터링 및 정렬**: 지역, 티타임, 그린피 등 다양한 조건으로 필터링하고, 가격순, 시간순 등으로 정렬할 수 있습니다.
- **사용자 인증**: `PrivateRoute`를 통해 인증된 사용자만 예약 관련 페이지에 접근할 수 있도록 제어합니다.
- **예약 프로세스**: 사용자가 원하는 골프장과 티타임을 선택하여 간편하게 예약할 수 있습니다.
- **예약 내역 관리**: 예약한 내역과 취소한 내역을 탭으로 구분하여 쉽게 확인할 수 있으며, 상세 정보 조회 및 예약 취소 기능을 제공합니다.
- **전역 상태 관리**: Zustand를 활용하여 모달(Alert, Confirm), 필터 상태 등을 전역으로 관리하여 코드의 일관성과 재사용성을 높였습니다.
- **서버 상태 관리**: TanStack Query (React Query)를 사용하여 API 요청, 캐싱, 에러 처리 등 서버 상태를 효율적으로 관리합니다.
- **재사용 가능한 UI**: `shadcn/ui` 스타일의 재사용 가능한 UI 컴포넌트와 유틸리티 함수(`toast`, `AlertModal`)를 구축하여 개발 생산성을 향상시켰습니다.

## 🛠️ 기술 스택

- **프레임워크**: React
- **빌드 도구**: Vite
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: `shadcn/ui` 기반의 커스텀 컴포넌트, sonner (Toast)
- **상태 관리**:
  - **클라이언트 상태**: Zustand
  - **서버 상태**: TanStack Query (React Query)
- **라우팅**: React Router DOM
- **API 통신**: Axios

## 📁 프로젝트 구조

프로젝트는 기능별로 모듈화된 구조를 따릅니다.

```
src
├── app/
│   │
│   └── routes/ # 라우팅 설정 (index.tsx, privateRoute.tsx)
│
└── features/
   │
   ├── golfCourses/ # 골프장 관련 기능 (목록, 상세, 검색)
   │   │
   │   ├── api/
   │   │   ├── queries.ts # React Query를 사용한 API 요청 함수
   │   │   └── types.ts # DTO & API 응답 타입 정의 (서버 응답 그대로의 전송 모델)
   │   │
   │   ├── components/ # 기능별 컴포넌트 (FilterModal.tsx, DateSelector.tsx)
   │   │
   │   ├── domain/ # 기능별 컴포넌트 (mappers.ts, types.ts)
   │   │   ├── mappers.ts # API에서 받은 DTO 를 도메인으로 변환(숫자/옵셔널 처리 등)
   │   │   └── types.ts # UI, 로직이 쓰는 도메인 모델
   │   │
   │   └── pages/ # 기능별 페이지 컴포넌트 (GolfCourseListPage.tsx)
   │
   ├── golfCourseBookings/ # 예약 관련 기능
   │
   ├── users/ # 회원 관련 기능
   │
   ├── lib/
   │   │
   │   └── utils.ts # shadcn/ui의 cn 유틸리티
   │
   ├── shared/
   │   │
   │   ├── components/ # 전역적으로 사용되는 공통 컴포넌트
   │   │   │
   │   │   ├── ui/ # 기본 UI 요소 (Button, Card, Dialog 등)
   │   │   │
   │   │   └── layout/ # 레이아웃 컴포넌트 (PageHeader.tsx, GlobalAlertModal.tsx)
   │   │
   │   ├── hooks/ # 공통 커스텀 훅 (useAuth.ts, useRequireAuth.ts)
   │   │
   │   ├── store/ # Zustand 전역 스토어 (userStore.ts, alertStore.ts)
   │   │
   │   └── utils/ # 공통 유틸리티 함수 (date.ts, toast.ts)
   │
   ├── main.tsx # 애플리케이션 진입점
   │
   └── index.css # 전역 CSS 및 Tailwind 설정
```

# 시작하기

## ⚙️ 실행

### 환경 변수 설정

.env.dev

```bash
VITE_API_URL=http://localhost:포트번호
```

.env.development

```bash
VITE_API_URL=dev 서버 주소
```

.env.production

```bash
VITE_API_URL=api 서버 주소
```

### 개발 서버 실행

로컬 모드 (.env.development 로드)

```bash
npm run dev
```

dev 모드 (.env.dev 로드)

```bash
npm run dev:dev
```

prod 모드 (.env.production 로드)

```bash
npm run dev:prod
```

## 🚀 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

### 테스트 빌드

```bash
npm run build:dev
```

### 빌드 결과물 미리보기

```bash
npm run preview
```
