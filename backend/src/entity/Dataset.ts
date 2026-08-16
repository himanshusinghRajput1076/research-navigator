import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('datasets')
export class Dataset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  source_url?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  license?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  domain?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  size_mb?: number;

  @Column({ type: 'int', nullable: true })
  num_samples?: number;

  @Column({ type: 'int', nullable: true })
  num_features?: number;

  @Column({ type: 'text', nullable: true })
  collection_method?: string;

  @Column({ type: 'text', nullable: true })
  known_limitations?: string;

  @Column({ type: 'varchar', length: 50, default: '1.0' })
  version!: string;

  @Column({ type: 'text', nullable: true })
  citation?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  doi?: string;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
