import { Memo } from '../../../../domain/memo.model';
import { DateUtils } from '../../../../../common/util/date.util';

export class MemoResponseDto {
  id: string;
  deviceId: string;
  sttText: string;
  summaryTitle: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;

  static fromDomain(memo: Memo): MemoResponseDto {
    const dto = new MemoResponseDto();
    dto.id = memo.id;
    dto.deviceId = memo.deviceId;
    dto.sttText = memo.sttText;
    dto.summaryTitle = memo.summaryTitle;
    dto.latitude = memo.latitude;
    dto.longitude = memo.longitude;
    dto.createdAt = DateUtils.toKST(memo.createdAt);
    dto.updatedAt = DateUtils.toKST(memo.updatedAt);
    return dto;
  }
}
