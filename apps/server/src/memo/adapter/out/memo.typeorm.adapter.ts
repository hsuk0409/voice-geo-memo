import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { MemoRepositoryPort } from '../../port/memo-repository.port';
import { Memo } from '../../domain/memo.model';
import { MemoEntity } from './memo.entity';
import { MemoMapper } from './memo.mapper';

@Injectable()
export class MemoTypeOrmAdapter implements MemoRepositoryPort {
  constructor(
    @InjectRepository(MemoEntity)
    private readonly memoRepository: Repository<MemoEntity>,
  ) {}

  async save(memo: Memo): Promise<Memo> {
    const persistence = MemoMapper.toPersistence(memo);
    const savedEntity = await this.memoRepository.save(persistence);
    return MemoMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Memo | null> {
    const entity = await this.memoRepository.findOne({ where: { id } });
    return entity ? MemoMapper.toDomain(entity) : null;
  }

  async findByDevice(
    deviceId: string,
    lat: number,
    lng: number,
    radiusMeter: number,
  ): Promise<Memo[]> {
    const entities = await this.memoRepository
      .createQueryBuilder('memo')
      .where('memo.deviceId = :deviceId', { deviceId })
      .andWhere(
        'ST_DWithin(memo.location, ST_MakePoint(:lng, :lat)::geography, :radiusMeter)',
        { lng, lat, radiusMeter },
      )
      .orderBy('memo.createdAt', 'DESC')
      .getMany();

    return entities.map((entity) => MemoMapper.toDomain(entity));
  }

  async delete(id: string, deviceId: string): Promise<void> {
    await this.memoRepository.delete({ id, deviceId });
  }
}
