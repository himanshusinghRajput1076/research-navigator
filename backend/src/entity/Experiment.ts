import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ExperimentStatus } from '../types';

@Entity('experiments')
export class Experiment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  project_id?: string;

  @Column({ type: 'uuid', nullable: true })
  hypothesis_id?: string;

  @Column({ type: 'uuid', nullable: true })
  problem_id?: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50, default: 'DESIGNED' })
  experiment_status!: ExperimentStatus;

  @Column({ type: 'text', nullable: true })
  methodology?: string;

  @Column({ type: 'text', nullable: true })
  baseline_method?: string;

  @Column({ type: 'text', nullable: true })
  proposed_method?: string;

  @Column({ type: 'jsonb', default: [] })
  alternative_methods!: string[];

  @Column({ type: 'uuid', nullable: true })
  dataset_id?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  code_repository?: string;

  @Column({ type: 'jsonb', default: {} })
  environment!: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  parameters!: Record<string, any>;

  @Column({ type: 'timestamptz', nullable: true })
  start_date?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  end_date?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
