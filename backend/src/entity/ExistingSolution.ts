import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('existing_solutions')
export class ExistingSolution {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  problem_id!: string;

  @Column({ type: 'uuid', nullable: true })
  paper_id?: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  methodology?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  algorithm_name?: string;

  @Column({ type: 'jsonb', default: {} })
  metrics!: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  results!: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  limitations?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
