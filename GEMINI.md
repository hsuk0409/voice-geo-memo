# 🤖 Project Context: voice-geo-memo (Agent Development Guidelines)

이 파일은 `voice-geo-memo` 프로젝트의 코드 생성 및 아키텍처 설계를 위한 절대적인 가이드라인이다. Gemini CLI 에이전트는 모든 코드 작성 시 아래 규칙을 반드시 준수해야 한다.

## 1. 프로젝트 개요 (Overview)
- **목표**: 온디바이스 STT와 위치 정보를 결합한 AI 음성 메모 앱.
- **주요 기능**: 음성 녹음, 기기 내 텍스트 변환(STT), AI 요약 타이틀 생성, 위치 기반 메모 필터링.

## 2. 공통 코딩 컨벤션 (General Rules)
- **언어**: TypeScript 사용 (명시적 타입 정의 필수).
- **파일명/폴더명**: `kebab-case`를 사용한다. (예: `memo-repository.port.ts`)
- **접미사(Suffix)**: 파일의 역할에 따라 `.model`, `.dto`, `.port`, `.adapter`, `.const`, `.decorator` 등을 반드시 붙인다.
- **변수/클래스명**: `camelCase` 또는 `PascalCase`(클래스)를 사용한다.

---

## 3. 백엔드 가이드라인 (NestJS - Hexagonal Architecture)
모든 비즈니스 로직은 **도메인 중심**으로 설계하며, 프레임워크와 외부 라이브러리로부터 격리한다.

### 폴더 구조 및 역할
루트 폴더는 `{domain-name}`으로 구성하며, 내부는 아래와 같이 격리한다.
- **`{domain}/domain/`**: 핵심 엔티티 및 비즈니스 모델 정의 (`.model.ts`).
- **`{domain}/port/`**: 계층 간 연결을 위한 인터페이스 정의 (`.port.ts`).
    - `Inbound Port`: 서비스 인터페이스 (Usecase).
    - `Outbound Port`: 리포지토리 또는 외부 시스템 호출 인터페이스.
- **`{domain}/adapter/`**: 프레임워크 및 외부 연동 구현체.
    - **`in/`**: Controller 등 외부 요청 진입점 (`.controller.ts`).
    - **`out/`**: DB(TypeORM/PostGIS) 및 외부 API 구현체 (`.adapter.ts`).
    - **`dto/`**: 데이터 전송 객체. 내부 폴더로 `in/`, `out/`을 두어 요청/응답 객체를 분리한다 (`.dto.ts`).
- **`common/`**: 공통 유틸리티, 커스텀 데코레이터, 공통 상수 관리.

---

## 4. 프론트엔드 가이드라인 (React Native)
유지보수와 성능 최적화를 위해 아래 구조와 컨벤션을 따른다.

### 구조 및 설계
- **Component**: 함수형 컴포넌트(RFC)와 Hooks 중심 설계.
- **Directory**:
    - `src/components/`: 재사용 가능한 원자(Atom) 단위 UI 컴포넌트.
    - `src/screens/`: 페이지 단위 컴포넌트.
    - `src/hooks/`: 비즈니스 로직 및 외부 API 연동(Location, Audio, STT)을 위한 커스텀 훅.
    - `src/services/`: 인프라스트럭처 연동 (API 클라이언트, 온디바이스 모델 로드 등).
    - `src/store/`: 전역 상태 관리 (Zustand 또는 TanStack Query 추천).

### 개발 원칙
- **Style**: `StyleSheet.create`를 기본으로 사용하며, 복잡한 경우 별도의 `.style.ts` 파일로 분리한다.
- **Performance**: `useMemo`, `useCallback`을 사용하여 불필요한 리렌더링을 방지한다.
- **Safe Area**: 노치 디자인 대응을 위해 `SafeAreaView`를 적절히 활용한다.

---

## 5. 핵심 기술 구현 지침
- **STT**: `react-native-whisper`를 활용한 온디바이스 처리를 기본으로 하며, 비동기 처리를 통해 UI 블로킹을 방지한다.
- **Geo-Query**: 위치 기반 조회 시 `PostGIS`의 공간 함수(`ST_DWithin` 등)를 사용하여 서버 성능을 최적화한다.