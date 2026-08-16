import { AppDataSource } from '../database';
import { ResearchGap } from '../entity/ResearchGap';

export class GapService {
  private gapRepo = AppDataSource.getRepository(ResearchGap);

  async getAll(userId: string, page = 1, limit = 20, filters?: { field_id?: string; gap_status?: string }) {
    const query = this.gapRepo.createQueryBuilder('g')
      .where('g.user_id = :userId', { userId })
      .andWhere('g.is_deleted = false');

    if (filters?.field_id) query.andWhere('g.field_id = :fieldId', { fieldId: filters.field_id });
    if (filters?.gap_status) query.andWhere('g.gap_status = :status', { status: filters.gap_status });

    const total = await query.getCount();
    const data = await query
      .orderBy('g.confidence_score', 'DESC')
      .addOrderBy('g.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const gap = await this.gapRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!gap) throw { status: 404, code: 'GAP_NOT_FOUND', message: 'Research gap not found' };
    return gap;
  }

  async create(data: Partial<ResearchGap>, userId: string) {
    const gap = this.gapRepo.create({ ...data, user_id: userId });
    return this.gapRepo.save(gap);
  }

  async update(id: string, data: Partial<ResearchGap>, userId: string) {
    const gap = await this.getById(id, userId);
    Object.assign(gap, data);
    return this.gapRepo.save(gap);
  }

  async delete(id: string, userId: string) {
    const gap = await this.getById(id, userId);
    gap.is_deleted = true;
    await this.gapRepo.save(gap);
    return { success: true };
  }
}
