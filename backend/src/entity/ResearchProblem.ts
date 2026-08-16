import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProblemStatus, DifficultyLevel } from '../types';

@Entity('research_problems')
export class ResearchProblem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  project_id?: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', nullable: true })
  real_world_problem?: string;

  @Column({ type: 'text', nullable: true })
  research_question?: string;

  @Column({ type: 'text', nullable: true })
  why_it_matters?: string;

  @Column({ type: 'varchar', length: 50, default: 'DISCOVERED' })
  status!: ProblemStatus;

  @Column({ type: 'varchar', length: 50, default: 'INTERMEDIATE' })
  difficulty_level!: DifficultyLevel;

  @Column({ type: 'int', default: 5 })
  impact_score!: number;

  @Column({ type: 'int', default: 5 })
  novelty_score!: number;

  @Column({ type: 'uuid' })
  field_id!: string;

  @Column({ type: 'uuid', nullable: true })
  subfield_id?: string;

  @Column({ type: 'text', nullable: true })
  known_limitations?: string;

  @Column({ type: 'jsonb', default: [] })
  possible_approaches!: Array<{ approach: string; description: string }>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
