import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateMemoCommand } from '../port/create-memo.command';
import type { MemoUseCase } from '../port/memo.usecase';
import { Memo } from './memo.model';
import { MEMO_REPOSITORY_PORT } from '../port/memo-repository.token';
import type { MemoRepositoryPort } from '../port/memo-repository.port';
import type { SummaryPort } from '../port/summary.port';
import { DateUtils } from '../../common/util/date.util';

@Injectable()
export class MemoService implements MemoUseCase {
  constructor(
    @Inject(MEMO_REPOSITORY_PORT)
    private readonly memoRepository: MemoRepositoryPort,
    @Inject('SUMMARY_PORT')
    private readonly summaryPort: SummaryPort,
  ) {}

  async createMemo(command: CreateMemoCommand): Promise<Memo> {
    // 1. AI 요약 제목 생성
    const summaryTitle = await this.summaryPort.summarize(command.sttText);

    // 2. 새로운 메모 도메인 객체 생성 (불변성 유지)
    const now = DateUtils.getNowUTC();
    const memo = new Memo(
      randomUUID(),
      command.deviceId,
      command.sttText,
      summaryTitle,
      command.latitude,
      command.longitude,
      now,
      now,
    );

    // 3. 저장 및 반환
    return this.memoRepository.save(memo);
  }

  async getMemosByDevice(
    deviceId: string,
    lat: number,
    lng: number,
    radiusMeter: number = 1000, // 기본 반경 1km
  ): Promise<Memo[]> {
    return this.memoRepository.findByDevice(deviceId, lat, lng, radiusMeter);
  }

  async getMemoDetail(id: string, deviceId: string): Promise<Memo | null> {
    const memo = await this.memoRepository.findById(id);
    if (!memo || memo.deviceId !== deviceId) {
      throw new NotFoundException('메모를 찾을 수 없거나 접근 권한이 없습니다.');
    }
    return memo;
  }

  async deleteMemo(id: string, deviceId: string): Promise<void> {
    // 본인의 메모인지 확인 후 삭제
    await this.getMemoDetail(id, deviceId);
    await this.memoRepository.delete(id, deviceId);
  }
}
