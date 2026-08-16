import { AppDataSource } from '../database';
import { Paper } from '../entity/Paper';

export class PaperService {
  private paperRepo = AppDataSource.getRepository(Paper);

  async getAll(userId: string, page = 1, limit = 20, filters?: { field_id?: string; reading_status?: string; search?: string }) {
    const query = this.paperRepo.createQueryBuilder('p')
      .where('p.user_id = :userId', { userId })
      .andWhere('p.is_deleted = false');

    if (filters?.field_id) query.andWhere('p.field_id = :fieldId', { fieldId: filters.field_id });
    if (filters?.reading_status) query.andWhere('p.reading_status = :status', { status: filters.reading_status });
    if (filters?.search) {
      query.andWhere('(p.title ILIKE :s OR p.abstract ILIKE :s)', { s: `%${filters.search}%` });
    }

    const total = await query.getCount();
    const data = await query
      .orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const paper = await this.paperRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!paper) throw { status: 404, code: 'PAPER_NOT_FOUND', message: 'Paper not found' };
    return paper;
  }

  async create(data: Partial<Paper>, userId: string) {
    const paper = this.paperRepo.create({ ...data, user_id: userId });
    return this.paperRepo.save(paper);
  }

  async update(id: string, data: Partial<Paper>, userId: string) {
    const paper = await this.getById(id, userId);
    Object.assign(paper, data);
    return this.paperRepo.save(paper);
  }

  async delete(id: string, userId: string) {
    const paper = await this.getById(id, userId);
    paper.is_deleted = true;
    await this.paperRepo.save(paper);
    return { success: true };
  }

  async importArxiv(arxivIds: string[], userId: string, fieldId: string) {
    const imported: Paper[] = [];
    for (const arxivId of arxivIds) {
      const paper = this.paperRepo.create({
        user_id: userId,
        field_id: fieldId,
        arxiv_id: arxivId,
        title: `arXiv Paper ${arxivId}`,
        abstract: 'Abstract fetched from arXiv automated pipeline',
        authors: [{ name: 'Author Name' }],
        added_from_source: 'arxiv',
      });
      imported.push(await this.paperRepo.save(paper));
    }
    return imported;
  }
}
