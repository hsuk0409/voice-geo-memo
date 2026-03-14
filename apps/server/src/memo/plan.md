# Memo Domain Development Plan (Hexagonal Architecture)

이 문서는 `voice-geo-memo` 프로젝트의 핵심 기능인 '음성 메모' 도메인의 백엔드 구현 계획을 정의합니다.

## 1. 개요 (Overview)
사용자의 음성과 위치 정보를 결합하여 기록하고, 이를 AI가 요약하여 제목을 생성하는 로컬 기반 메모 관리 시스템입니다.

## 2. 역할 분담 (Responsibilities)

### 2.1 Backend (NestJS Server)
- **Data Persistence**: PostGIS를 사용하여 위치 정보와 메모 메타데이터 저장.
- **AI Summary Service**: 무료 프로세스 우선(Gemini Free 등)으로 제목 요약 생성.
- **Spatial Search**: 특정 기기(`deviceId`)와 위치 기준 반경 내 메모 조회.

### 2.2 Frontend (React Native Mobile)
- **Audio & STT**: 녹음 및 온디바이스 STT 수행.
- **Device Identification**: 기기 고유 `deviceId` 관리.
- **Client Sync**: 변환된 텍스트와 위치 정보를 서버로 전송.

## 3. 데이터 모델 분리 및 순환 참조 방지 (Model & Dependency)

### 3.1 도메인 모델 (`memo.model.ts`)
- **역할**: 순수 비즈니스 로직. **외부 엔티티나 어댑터에 대한 의존성 없음.**
- **특징**: 불변 객체(Immutable), 비즈니스 상태 변경 메서드만 포함.
- **설계 결정 (Parameter Properties)**:
  - TypeScript의 **Parameter Properties(문법적 설탕)** 기능을 활용하여 생성자 매개변수에서 직접 필드 선언, 정의, 할당(`public readonly`)을 처리합니다.
  - 이 방식은 Boilerplate 코드를 획기적으로 줄여 도메인 모델의 핵심 구조를 한눈에 파악하기 쉽게 하며, 모든 필드에 `readonly`를 강제하여 데이터의 **불변성(Immutability)**을 명시적으로 보장합니다.

### 3.2 엔티티 모델 (`memo.entity.ts`)
- **역할**: DB 테이블 매핑 전용. **도메인 모델에 대한 의존성 없음.**
- **특징**: TypeORM 데코레이터 및 PostGIS 필드 정의에 집중.

### 3.3 매퍼 (`memo.mapper.ts`)
- **역할**: 도메인 모델과 엔티티 모델 간의 변환.
- **위치**: `adapter/out` (영속성 계층).
- **이유**: 순환 참조를 방지하고 도메인 레이어의 순수성을 보장하기 위함.

## 4. 아키텍처 설계 (Hexagonal Architecture)

### 4.1 핵심 코드 스니팻 (Concepts)

#### [Domain] `Memo` 모델 (Pure)
```typescript
export class Memo {
  constructor(
    public readonly id: string,
    public readonly deviceId: string,
    public readonly sttText: string,
    public readonly summaryTitle: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  withSummary(newTitle: string): Memo {
    return new Memo(
      this.id, this.deviceId, this.sttText, newTitle,
      this.latitude, this.longitude, this.createdAt, new Date()
    );
  }
}
```

#### [Adapter-Out] `MemoMapper` (Breaking Cycles)
```typescript
export class MemoMapper {
  static toDomain(entity: MemoEntity): Memo {
    // WKT Point 파싱 및 도메인 객체 생성
    return new Memo(...);
  }

  static toPersistence(domain: Memo): MemoEntity {
    // 도메인 데이터를 DB 엔티티 형식으로 변환 (Geography Point 생성)
    const entity = new MemoEntity();
    entity.id = domain.id;
    ...
    return entity;
  }
}
```

## 5. 단계별 구현 계획

### Phase 1: 기반 설정 및 도메인 정의
- [x] `memo.model.ts` 순수 도메인 모델 정의
- [x] `memo.entity.ts` 순수 TypeORM 엔티티 정의
- [x] `memo.mapper.ts` 양방향 변환 로직 구현
- [x] `memo-repository.port.ts` 인터페이스 작성

### Phase 2: 어댑터 및 서비스 구현
- [x] `MemoTypeOrmAdapter` 구현 (Mapper 활용)
- [x] `MemoService` (Usecase) 및 AI 요약 연동

### Phase 3: API 노출 및 검증
- [x] `MemoController` 및 DTO 구현
- [x] 단위 테스트 작성 및 검증 (Mock 기반)
- [x] `MemoModule` 및 `AppModule` 의존성 조립 완료

---

## 6. 설계 트레이드오프 (Trade-offs)

1. **분리된 Mapper를 통한 순환 참조 방지**
   - **장점**: 모델 간의 결합도가 완전히 제거되어 도메인 모델이 DB 기술로부터 완전히 독립됩니다.
   - **단점**: 변환을 위해 별도의 클래스(`MemoMapper`)를 호출해야 하므로 단계가 하나 더 추가됩니다.

2. **Index 설정 (deviceId, location)**
   - 기기별/위치별 검색 성능 최적화.

3. **UTC 저장 및 KST 처리**
   - 글로벌 표준 저장 방식 채택.

4. **서버 오디오 저장 생략**
   - 가벼운 서버 유지 및 개인정보 관리 효율화.

---

## 7. 최종 완료 보고 (Final Report)

### 구현 결과 요약
1. **아키텍처**: 헥사고날 아키텍처를 적용하여 도메인 모델(`Memo`)과 영속성 엔티티(`MemoEntity`)를 완벽히 분리하고, `MemoMapper`를 통해 양방향 변환 로직을 캡슐화했습니다.
2. **기술 스택**: NestJS, TypeORM(PostGIS), ConfigModule, dayjs, crypto(randomUUID)를 활용하여 안정적인 백엔드 기반을 구축했습니다.
3. **주요 기능**:
    - **메모 생성**: STT 텍스트와 위경도를 받아 AI 요약(Mock)과 함께 저장.
    - **위치 기반 검색**: PostGIS의 `ST_DWithin`을 활용하여 특정 기기 및 반경 내 메모 필터링.
    - **시간대 관리**: DB는 UTC로 저장하고, 응답 시 KST(한국 시간)로 변환하는 유틸리티를 적용했습니다.
4. **검증**: `MemoService` 및 `MemoController`에 대한 단위 테스트를 작성하여 비즈니스 로직과 API 동작을 검증 완료했습니다. 모든 테스트 파일은 `src/memo/test/` 폴더에 통합 관리됩니다.

*본 구현은 2026-03-07에 완료되었습니다.*

