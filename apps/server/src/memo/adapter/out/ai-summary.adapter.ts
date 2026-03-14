import { Injectable } from '@nestjs/common';
import type { SummaryPort } from '../../port/summary.port';

@Injectable()
export class AiSummaryAdapter implements SummaryPort {
  async summarize(text: string): Promise<string> {
    // Phase 2 초기: 간단한 로직으로 제목 생성 (Mock)
    // 10자까지만 자르고 '...'을 붙여 제목으로 사용
    const title = text.length > 15 ? text.substring(0, 15) + '...' : text;
    return `[AI 요약] ${title}`;
  }
}
