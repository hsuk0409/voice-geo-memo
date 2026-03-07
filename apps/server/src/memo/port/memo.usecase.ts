import { Memo } from '../domain/memo.model';
import { CreateMemoCommand } from './create-memo.command';

export interface MemoUseCase {
  createMemo(command: CreateMemoCommand): Promise<Memo>;
  getMemosByDevice(
    deviceId: string,
    lat: number,
    lng: number,
    radiusMeter: number,
  ): Promise<Memo[]>;
  getMemoDetail(id: string, deviceId: string): Promise<Memo | null>;
  deleteMemo(id: string, deviceId: string): Promise<void>;
}
