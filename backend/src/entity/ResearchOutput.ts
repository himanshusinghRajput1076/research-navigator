import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OutputType, OutputStatus } from '../types';

@Entity('research_outputs')
export class ResearchOutput {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  project_id?: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50, default: 'paper' })
  output_type!: OutputType;

  @Column({ type: 'varchar', length: 50, default: 'DRAFT' })
  status!: OutputStatus;

  @Column({ type: 'text', nullable: true })
  abstract?: string;

  @Column({ type: 'varchar', length: 50, default: '1.0' })
  version!: string;

  @Column({ type: 'jsonb', default: [] })
  related_problems!: string[];

  @Column({ type: 'jsonb', default: [] })
  related_experiments!: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  repository_url?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  paper_url?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  doi?: string;

  @Column({ type: 'date', nullable: true })
  submission_date?: string;

  @Column({ type: 'date', nullable: true })
  publication_date?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  submission_venue?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  license?: string;

  @Column({ type: 'boolean', default: false })
  is_open_source!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
