import { AppDataSource } from '../database';
import { Paper } from '../entity/Paper';
import { ResearchProblem } from '../entity/ResearchProblem';
import { ResearchGap } from '../entity/ResearchGap';

export class SearchService {
  async globalSearch(query: string, userId: string) {
    const paperRepo = AppDataSource.getRepository(Paper);
    const problemRepo = AppDataSource.getRepository(ResearchProblem);
    const gapRepo = AppDataSource.getRepository(ResearchGap);

    const papers = await paperRepo.createQueryBuilder('p')
      .where('p.user_id = :userId AND p.is_deleted = false', { userId })
      .andWhere('(p.title ILIKE :q OR p.abstract ILIKE :q)', { q: `%${query}%` })
      .take(10)
      .getMany();

    const problems = await problemRepo.createQueryBuilder('pr')
      .where('pr.user_id = :userId AND pr.is_deleted = false', { userId })
      .andWhere('(pr.title ILIKE :q OR pr.description ILIKE :q)', { q: `%${query}%` })
      .take(10)
      .getMany();

    const gaps = await gapRepo.createQueryBuilder('g')
      .where('g.user_id = :userId AND g.is_deleted = false', { userId })
      .andWhere('(g.title ILIKE :q OR g.gap_statement ILIKE :q)', { q: `%${query}%` })
      .take(10)
      .getMany();

    return {
      query,
      results: {
        papers,
        problems,
        gaps,
      },
    };
  }
}
