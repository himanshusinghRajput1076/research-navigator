import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('api_audit_log')
export class ApiAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  user_id?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  method?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  endpoint?: string;

  @Column({ type: 'int', nullable: true })
  status_code?: number;

  @Column({ type: 'int', nullable: true })
  response_time_ms?: number;

  @Column({ type: 'text', nullable: true })
  error_message?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
