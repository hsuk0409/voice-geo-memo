import { Entity, PrimaryColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('memos')
export class MemoEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  @Index()
  deviceId: string;

  @Column('text')
  sttText: string;

  @Column()
  summaryTitle: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Index({ spatial: true })
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
