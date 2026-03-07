import { Test, TestingModule } from '@nestjs/testing';
import { MemoService } from '../domain/memo.service';
import { MEMO_REPOSITORY_PORT } from '../port/memo-repository.token';
import { MemoRepositoryPort } from '../port/memo-repository.port';
import { CreateMemoCommand } from '../port/create-memo.command';
import { Memo } from '../domain/memo.model';

describe('MemoService', () => {
  let service: MemoService;
  let repository: jest.Mocked<MemoRepositoryPort>;
  let summaryPort: jest.Mocked<{ summarize: jest.Mock }>;

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByDevice: jest.fn(),
      delete: jest.fn(),
    };

    const mockSummaryPort = {
      summarize: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoService,
        {
          provide: MEMO_REPOSITORY_PORT,
          useValue: mockRepository,
        },
        {
          provide: 'SUMMARY_PORT',
          useValue: mockSummaryPort,
        },
      ],
    }).compile();

    service = module.get<MemoService>(MemoService);
    repository = module.get(MEMO_REPOSITORY_PORT as any); // Type safety bypass for Mock
    summaryPort = module.get('SUMMARY_PORT');
  });

  it('메모를 생성하면 AI 요약을 호출하고 리포지토리에 저장해야 한다', async () => {
    // Given
    const command: CreateMemoCommand = {
      deviceId: 'test-device-id',
      sttText: '오늘 날씨가 참 좋네요.',
      latitude: 37.123,
      longitude: 127.123,
    };
    const mockSummary = '[AI 요약] 오늘 날씨가 참...';
    summaryPort.summarize.mockResolvedValue(mockSummary);
    repository.save.mockImplementation(async (memo: Memo) => memo);

    // When
    const result = await service.createMemo(command);

    // Then
    expect(summaryPort.summarize).toHaveBeenCalledWith(command.sttText);
    expect(repository.save).toHaveBeenCalled();
    expect(result.summaryTitle).toBe(mockSummary);
    expect(result.deviceId).toBe(command.deviceId);
    expect(result.sttText).toBe(command.sttText);
  });
});
