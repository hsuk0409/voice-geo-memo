import { Memo } from '../domain/memo.model';

export interface MemoRepositoryPort {
  save(memo: Memo): Promise<Memo>;
  findById(id: string): Promise<Memo | null>;
  findByDevice(
    deviceId: string,
    lat: number,
    lng: number,
    radiusMeter: number,
  ): Promise<Memo[]>;
  delete(id: string, deviceId: string): Promise<void>;
}
