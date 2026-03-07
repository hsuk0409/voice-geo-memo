import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  Inject,
  ParseFloatPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MEMO_USE_CASE } from '../../port/memo-usecase.token';
import { MemoUseCase } from '../../port/memo.usecase';
import { CreateMemoDto } from './dto/in/create-memo.dto';
import { MemoResponseDto } from './dto/out/memo-response.dto';

@Controller('memos')
export class MemoController {
  constructor(
    @Inject(MEMO_USE_CASE)
    private readonly memoUseCase: MemoUseCase,
  ) {}

  @Post()
  async createMemo(@Body() createMemoDto: CreateMemoDto): Promise<MemoResponseDto> {
    const memo = await this.memoUseCase.createMemo(createMemoDto);
    return MemoResponseDto.fromDomain(memo);
  }

  @Get()
  async getMemos(
    @Query('deviceId') deviceId: string,
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', new ParseIntPipe({ optional: true })) radiusMeter?: number,
  ): Promise<MemoResponseDto[]> {
    const memos = await this.memoUseCase.getMemosByDevice(
      deviceId,
      lat,
      lng,
      radiusMeter || 1000,
    );
    return memos.map((memo) => MemoResponseDto.fromDomain(memo));
  }

  @Get(':id')
  async getMemo(
    @Param('id') id: string,
    @Query('deviceId') deviceId: string,
  ): Promise<MemoResponseDto> {
    const memo = await this.memoUseCase.getMemoDetail(id, deviceId);
    return MemoResponseDto.fromDomain(memo!);
  }

  @Delete(':id')
  async deleteMemo(
    @Param('id') id: string,
    @Query('deviceId') deviceId: string,
  ): Promise<void> {
    await this.memoUseCase.deleteMemo(id, deviceId);
  }
}
