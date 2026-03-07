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
