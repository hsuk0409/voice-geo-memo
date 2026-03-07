import { Memo } from '../../domain/memo.model';
import { MemoEntity } from './memo.entity';

export class MemoMapper {
  static toDomain(entity: MemoEntity): Memo {
    // PostGIS POINT(lng lat) 형식 파싱
    // 예: "POINT(127.123 37.123)" -> [127.123, 37.123]
    const pointMatch = entity.location.match(/\((.*)\)/);
    const coords = pointMatch ? pointMatch[1].split(' ') : ['0', '0'];
    
    const longitude = parseFloat(coords[0]);
    const latitude = parseFloat(coords[1]);

    return new Memo(
      entity.id,
      entity.deviceId,
      entity.sttText,
      entity.summaryTitle,
      latitude,
      longitude,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Memo): MemoEntity {
    const entity = new MemoEntity();
    entity.id = domain.id;
    entity.deviceId = domain.deviceId;
    entity.sttText = domain.sttText;
    entity.summaryTitle = domain.summaryTitle;
    // WKT 형식: POINT(경도 위도)
    entity.location = `POINT(${domain.longitude} ${domain.latitude})`;
    // createdAt, updatedAt은 TypeORM이 관리하므로 명시적으로 넣지 않음 (필요시 수동 할당 가능)
    return entity;
  }
}
