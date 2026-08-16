import { AppDataSource } from '../database';
import { Citation } from '../entity/Citation';

export class CitationService {
  private citeRepo = AppDataSource.getRepository(Citation);

  async getForPaper(paperId: string) {
    const citing = await this.citeRepo.find({ where: { citing_paper_id: paperId } });
    const cited = await this.citeRepo.find({ where: { cited_paper_id: paperId } });
    return { citing, cited };
  }

  async create(data: Partial<Citation>) {
    const cite = this.citeRepo.create(data);
    return this.citeRepo.save(cite);
  }
}
