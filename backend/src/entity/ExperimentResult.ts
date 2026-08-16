import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('experiment_results')
export class ExperimentResult {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  experiment_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  method_variant?: string;

  @Column({ type: 'decimal', precision: 7, scale: 4, nullable: true })
  accuracy?: number;

  @Column({ type: 'decimal', precision: 7, scale: 4, nullable: true })
  precision_score?: number;

  @Column({ type: 'decimal', precision: 7, scale: 4, nullable: true })
  recall?: number;

  @Column({ type: 'decimal', precision: 7, scale: 4, nullable: true })
  f1_score?: number;

  @Column({ type: 'decimal', precision: 7, scale: 4, nullable: true })
  auc?: number;

  @Column({ type: 'decimal', nullable: true })
  mse?: number;

  @Column({ type: 'decimal', nullable: true })
  rmse?: number;

  @Column({ type: 'decimal', nullable: true })
  mae?: number;

  @Column({ type: 'decimal', nullable: true })
  latency_ms?: number;

  @Column({ type: 'decimal', nullable: true })
  throughput_rps?: number;

  @Column({ type: 'decimal', nullable: true })
  memory_mb?: number;

  @Column({ type: 'decimal', nullable: true })
  cpu_percent?: number;

  @Column({ type: 'decimal', nullable: true })
  gpu_percent?: number;

  @Column({ type: 'decimal', nullable: true })
  energy_kwh?: number;

  @Column({ type: 'decimal', nullable: true })
  cost_usd?: number;

  @Column({ type: 'jsonb', default: {} })
  custom_metrics!: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  observations?: string;

  @Column({ type: 'text', nullable: true })
  conclusion?: string;

  @Column({ type: 'varchar', length: 50, default: 'REPRODUCIBLE' })
  reproducibility_status!: string;

  @Column({ type: 'int', nullable: true })
  execution_time_seconds?: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
