import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { CitationType } from '../types';

@Entity('citations')
export class Citation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  citing_paper_id!: string;

  @Column({ type: 'uuid' })
  cited_paper_id!: string;

  @Column({ type: 'text', nullable: true })
  context?: string;

  @Column({ type: 'varchar', length: 50, default: 'supports' })
  citation_type!: CitationType;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
