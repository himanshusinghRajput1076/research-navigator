import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ReadingStatus } from '../types';

@Entity('papers')
export class Paper {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  project_id?: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  abstract?: string;

  @Column({ type: 'jsonb', default: [] })
  authors!: Array<{ name: string; email?: string; institution?: string; orcid?: string }>;

  @Column({ type: 'int', nullable: true })
  publication_year?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  venue?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  doi?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  arxiv_id?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  url?: string;

  @Column({ type: 'text', array: true, nullable: true })
  keywords?: string[];

  @Column({ type: 'uuid' })
  field_id!: string;

  @Column({ type: 'uuid', nullable: true })
  subfield_id?: string;

  @Column({ type: 'text', nullable: true })
  methodology?: string;

  @Column({ type: 'jsonb', default: [] })
  datasets!: Array<{ name: string; url?: string; size?: string }>;

  @Column({ type: 'jsonb', default: [] })
  algorithms!: string[];

  @Column({ type: 'jsonb', default: {} })
  metrics!: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  results!: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  limitations?: string;

  @Column({ type: 'text', nullable: true })
  future_work?: string;

  @Column({ type: 'varchar', length: 50, default: 'UNREAD' })
  reading_status!: ReadingStatus;

  @Column({ type: 'int', default: 5 })
  importance_score!: number;

  @Column({ type: 'text', nullable: true })
  personal_notes?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  pdf_url?: string;

  @Column({ type: 'boolean', default: false })
  pdf_extracted!: boolean;

  @Column({ type: 'varchar', length: 50, default: 'manual' })
  added_from_source!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
