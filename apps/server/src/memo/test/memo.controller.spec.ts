import { Test, TestingModule } from '@nestjs/testing';
import { MemoController } from '../adapter/in/memo.controller';
import { MEMO_USE_CASE } from '../port/memo-usecase.token';
import { CreateMemoDto } from '../adapter/in/dto/in/create-memo.dto';
import { Memo } from '../domain/memo.model';

describe('MemoController', () => {
  let controller: MemoController;
  let useCase: jest.Mocked<{ createMemo: jest.Mock; getMemosByDevice: jest.Mock }>;

  beforeEach(async () => {
    const mockUseCase = {
      createMemo: jest.fn(),
      getMemosByDevice: jest.fn(),
      getMemoDetail: jest.fn(),
      deleteMemo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemoController],
      providers: [
        {
          provide: MEMO_USE_CASE,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controller = module.get<MemoController>(MemoController);
    useCase = module.get(MEMO_USE_CASE as any);
  });

  it('POST /memos 요청 시 메모를 생성하고 반환해야 한다', async () => {
    // Given
    const dto: CreateMemoDto = {
      deviceId: 'test-device',
      sttText: '테스트 메모',
      latitude: 37,
      longitude: 127,
    };
    const mockMemo = new Memo(
      'id-1',
      dto.deviceId,
      dto.sttText,
      '[요약] 테스트',
      dto.latitude,
      dto.longitude,
      new Date(),
      new Date(),
    );
    useCase.createMemo.mockResolvedValue(mockMemo);

    // When
    const result = await controller.createMemo(dto);

    // Then
    expect(useCase.createMemo).toHaveBeenCalled();
    expect(result.id).toBe(mockMemo.id);
    expect(result.summaryTitle).toBe(mockMemo.summaryTitle);
  });
});
