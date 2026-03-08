/**
 * Memo 도메인 모델
 * TypeScript의 'Parameter Properties' 기능을 사용하여 필드 선언과 생성을 동시에 처리합니다.
 * 모든 필드는 'readonly'로 설정하여 데이터의 불변성(Immutability)을 보장합니다.
 */
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

  /**
   * AI 요약 제목이 업데이트된 새로운 Memo 객체를 반환합니다 (원본 객체 유지).
   */
  withSummary(newTitle: string): Memo {
    return new Memo(
      this.id,
      this.deviceId,
      this.sttText,
      newTitle,
      this.latitude,
      this.longitude,
      this.createdAt,
      new Date(),
    );
  }
}
