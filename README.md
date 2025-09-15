# 모노레포

서비스를 함께 관리하기 위해 Turborepo를 사용한 모노레포로 구성되어 있습니다.  
Turborepo는 모노레포를 위한 고성능 빌드 시스템으로, 여러 개의 개별 프로젝트를 하나의 저장소에 통합 관리하는 전략입니다.

## 1. 프로젝트 개요

이 프로젝트는 각 서비스를 개별적인 저장소로 분리하여 멀티레포로 관리되고 있는 서비스를 하나의 저장소에 통합하여 모노레포로 관리하기 위함입니다.

## 2. 프로젝트 구조

```
monorepo/
│
├── apps/ # 애플리케이션 서비스
│   │
│   └── web-app/ # 실시간 골프 예약 웹 애플리케이션
│
└── packages/ # 여러 애플리케이션에서 공유하여 사용할 수 있는 라이브러리, 컴포넌트, 유틸리티 함수
    │
    ├── eslint-config/ # ESLint 설정
    │
    ├── typescript-config/ # TypeScript 설정
    │
    └── prettier-config/ # Prettier 설정


```

## 3. [모노레포 코드 품질 가이드](https://broad-meerkat-c62.notion.site/26f1b63fe1bb80c7a627d0bbbe8794ec?pvs=74)  
monorepo 에서 사용하는 코드 품질 도구(ESLint, Prettier, TypeScript, Husky)의 설정과 사용 방법을 정리하였습니다.  

# 시작하기

### 사전 준비

1.  **Node.js**: v20.x 이상 버전을 사용해주세요. (`nvm` 사용을 권장)
2.  **npm**: v10.x 이상 버전을 사용해주세요.

## ⚙️ 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/gukHyeonGeum/monorepo.git
cd monorepo
```

### 2. 종속성 설치

```bash
npm install
```

## 개발 환경 실행

Turborepo를 사용하여 모든 패키지의 개발 서버를 동시에 실행하거나, 개별적으로 실행할 수 있습니다.

### 전체 동시 실행 & 빌드

```bash
# apps 애플리케이션을 동시에 실행합니다.
npm run dev

# apps 애플리케이션을 동시에 빌드합니다.
npm run build
```

### 개별 실행

```bash
# 로컬 모드
npx turbo run dev --filter=web-app
or
# 로컬 모드
npm run dev --workspace=web-app

# dev 모드
npm run dev:dev --workspace=web-app

# prod 모드
npm run dev:prod --workspace=web-app
```

## 🚀 빌드 및 배포

### 프로덕션 빌드

```bash
# apps 애플리케이션을 동시에 빌드합니다.
npm run build
```

### 개별 빌드

```bash
# production 모드
npx turbo run build --filter=web-app
or
# production 모드
npm run build --workspace=web-app

# dev 모드
npm run build:dev --workspace=web-app
```

## 미리보기 & ESLint & types & format

### 빌드 결과물 미리보기

```bash
npm run preview --workspace=web-app
```

### ESLint 검사

```bash
npm run lint
```

### types 체크

```bash
npm run check-types
```

### format prettier

```bash
npm run format
```
