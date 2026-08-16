import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('paper_researchers')
export class PaperResearcher {
  @PrimaryColumn({ type: 'uuid' })
  paper_id!: string;

  @PrimaryColumn({ type: 'uuid' })
  researcher_id!: string;

  @Column({ type: 'int', default: 1 })
  author_order!: number;
}
