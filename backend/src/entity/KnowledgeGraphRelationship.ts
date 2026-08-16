import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('knowledge_graph_relationships')
export class KnowledgeGraphRelationship {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  source_entity_id!: string;

  @Column({ type: 'varchar', length: 50 })
  source_entity_type!: string;

  @Column({ type: 'uuid' })
  target_entity_id!: string;

  @Column({ type: 'varchar', length: 50 })
  target_entity_type!: string;

  @Column({ type: 'varchar', length: 100 })
  relationship_type!: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  strength!: number;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
