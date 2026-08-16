import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { HypothesisStatus } from '../types';

@Entity('hypotheses')
export class Hypothesis {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  project_id?: string;

  @Column({ type: 'uuid', nullable: true })
  gap_id?: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', nullable: true })
  hypothesis_statement?: string;

  @Column({ type: 'text', nullable: true })
  predicted_outcome?: string;

  @Column({ type: 'jsonb', default: [] })
  assumptions!: string[];

  @Column({ type: 'varchar', length: 50, default: 'PROPOSED' })
  status!: HypothesisStatus;

  @Column({ type: 'int', default: 5 })
  confidence_score!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
