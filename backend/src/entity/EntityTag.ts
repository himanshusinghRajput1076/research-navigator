import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('entity_tags')
export class EntityTag {
  @PrimaryColumn({ type: 'uuid' })
  entity_id!: string;

  @PrimaryColumn({ type: 'varchar', length: 50 })
  entity_type!: string;

  @PrimaryColumn({ type: 'uuid' })
  tag_id!: string;
}
