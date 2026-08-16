import { AppDataSource } from '../database';
import { Hypothesis } from '../entity/Hypothesis';

export class HypothesisService {
  private hypoRepo = AppDataSource.getRepository(Hypothesis);

  async getAll(userId: string, page = 1, limit = 20, status?: string) {
    const query = this.hypoRepo.createQueryBuilder('h')
      .where('h.user_id = :userId', { userId })
      .andWhere('h.is_deleted = false');

    if (status) query.andWhere('h.status = :status', { status });

    const total = await query.getCount();
    const data = await query
      .orderBy('h.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const hypo = await this.hypoRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!hypo) throw { status: 404, code: 'HYPOTHESIS_NOT_FOUND', message: 'Hypothesis not found' };
    return hypo;
  }

  async create(data: Partial<Hypothesis>, userId: string) {
    const hypo = this.hypoRepo.create({ ...data, user_id: userId });
    return this.hypoRepo.save(hypo);
  }

  async update(id: string, data: Partial<Hypothesis>, userId: string) {
    const hypo = await this.getById(id, userId);
    Object.assign(hypo, data);
    return this.hypoRepo.save(hypo);
  }

  async delete(id: string, userId: string) {
    const hypo = await this.getById(id, userId);
    hypo.is_deleted = true;
    await this.hypoRepo.save(hypo);
    return { success: true };
  }
}
