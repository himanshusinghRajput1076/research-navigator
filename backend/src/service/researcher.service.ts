import { AppDataSource } from '../database';
import { Researcher } from '../entity/Researcher';

export class ResearcherService {
  private resRepo = AppDataSource.getRepository(Researcher);

  async getAll(userId: string, page = 1, limit = 20, search?: string) {
    const query = this.resRepo.createQueryBuilder('r')
      .where('r.added_by = :userId', { userId })
      .andWhere('r.is_deleted = false');

    if (search) {
      query.andWhere('(r.name ILIKE :s OR r.institution ILIKE :s)', { s: `%${search}%` });
    }

    const total = await query.getCount();
    const data = await query
      .orderBy('r.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const res = await this.resRepo.findOne({ where: { id, added_by: userId, is_deleted: false } });
    if (!res) throw { status: 404, code: 'RESEARCHER_NOT_FOUND', message: 'Researcher not found' };
    return res;
  }

  async create(data: Partial<Researcher>, userId: string) {
    const res = this.resRepo.create({ ...data, added_by: userId });
    return this.resRepo.save(res);
  }

  async update(id: string, data: Partial<Researcher>, userId: string) {
    const res = await this.getById(id, userId);
    Object.assign(res, data);
    return this.resRepo.save(res);
  }

  async delete(id: string, userId: string) {
    const res = await this.getById(id, userId);
    res.is_deleted = true;
    await this.resRepo.save(res);
    return { success: true };
  }
}
