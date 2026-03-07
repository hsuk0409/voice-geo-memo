import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoController } from './adapter/in/memo.controller';
import { MemoService } from './domain/memo.service';
import { MemoTypeOrmAdapter } from './adapter/out/memo.typeorm.adapter';
import { AiSummaryAdapter } from './adapter/out/ai-summary.adapter';
import { MemoEntity } from './adapter/out/memo.entity';
import { MEMO_REPOSITORY_PORT } from './port/memo-repository.token';
import { MEMO_USE_CASE } from './port/memo-usecase.token';

@Module({
  imports: [TypeOrmModule.forFeature([MemoEntity])],
  controllers: [MemoController],
  providers: [
    {
      provide: MEMO_USE_CASE,
      useClass: MemoService,
    },
    {
      provide: MEMO_REPOSITORY_PORT,
      useClass: MemoTypeOrmAdapter,
    },
    {
      provide: 'SUMMARY_PORT', // 간단히 문자열 토큰 사용
      useClass: AiSummaryAdapter,
    },
  ],
  exports: [MEMO_USE_CASE],
})
export class MemoModule {}
