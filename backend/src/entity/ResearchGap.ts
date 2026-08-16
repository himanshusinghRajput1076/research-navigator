import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GapStatus } from '../types';

@Entity('research_gaps')
export class ResearchGap {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  problem_id?: string;

  @Column({ type: 'uuid' })
  field_id!: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text' })
  gap_statement!: string;

  @Column({ type: 'text', nullable: true })
  evidence?: string;

  @Column({ type: 'varchar', length: 50, default: 'POTENTIAL' })
  gap_status!: GapStatus;

  @Column({ type: 'text', nullable: true })
  known_limitations?: string;

  @Column({ type: 'text', nullable: true })
  what_not_tested?: string;

  @Column({ type: 'int', default: 5 })
  confidence_score!: number;

  @Column({ type: 'int', default: 5 })
  novelty_estimate!: number;

  @Column({ type: 'int', default: 5 })
  impact_estimate!: number;

  @Column({ type: 'jsonb', default: [] })
  supporting_papers!: Array<{ paper_id: string; title: string; relevance?: string }>;

  @Column({ type: 'jsonb', default: [] })
  contradicting_papers!: Array<{ paper_id: string; title: string; relevance?: string }>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
