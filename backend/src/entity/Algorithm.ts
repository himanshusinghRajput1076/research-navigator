import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('algorithms')
export class Algorithm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  time_complexity?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  space_complexity?: string;

  @Column({ type: 'uuid', nullable: true })
  paper_reference?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  implementation_url?: string;

  @Column({ type: 'jsonb', default: [] })
  pros!: string[];

  @Column({ type: 'jsonb', default: [] })
  cons!: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
