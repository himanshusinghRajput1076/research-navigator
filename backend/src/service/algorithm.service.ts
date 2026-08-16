import { AppDataSource } from '../database';
import { Algorithm } from '../entity/Algorithm';

export class AlgorithmService {
  private algoRepo = AppDataSource.getRepository(Algorithm);

  async getAll(userId: string, page = 1, limit = 20, category?: string) {
    const query = this.algoRepo.createQueryBuilder('a')
      .where('a.user_id = :userId', { userId })
      .andWhere('a.is_deleted = false');

    if (category) query.andWhere('a.category = :category', { category });

    const total = await query.getCount();
    const data = await query
      .orderBy('a.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const algo = await this.algoRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!algo) throw { status: 404, code: 'ALGORITHM_NOT_FOUND', message: 'Algorithm not found' };
    return algo;
  }

  async create(data: Partial<Algorithm>, userId: string) {
    const algo = this.algoRepo.create({ ...data, user_id: userId });
    return this.algoRepo.save(algo);
  }

  async update(id: string, data: Partial<Algorithm>, userId: string) {
    const algo = await this.getById(id, userId);
    Object.assign(algo, data);
    return this.algoRepo.save(algo);
  }

  async delete(id: string, userId: string) {
    const algo = await this.getById(id, userId);
    algo.is_deleted = true;
    await this.algoRepo.save(algo);
    return { success: true };
  }
}
