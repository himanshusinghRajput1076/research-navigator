import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('researchers')
export class Researcher {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  added_by!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  institution?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({ type: 'text', array: true, nullable: true })
  research_areas?: string[];

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  orcid_id?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  google_scholar_url?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  semantic_scholar_id?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  personal_website?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  github_username?: string;

  @Column({ type: 'int', nullable: true })
  h_index?: number;

  @Column({ type: 'int', nullable: true })
  total_citations?: number;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'manual' })
  source!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;
}
