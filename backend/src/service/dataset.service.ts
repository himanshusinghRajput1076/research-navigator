import { AppDataSource } from '../database';
import { Dataset } from '../entity/Dataset';

export class DatasetService {
  private datasetRepo = AppDataSource.getRepository(Dataset);

  async getAll(userId: string, page = 1, limit = 20, domain?: string) {
    const query = this.datasetRepo.createQueryBuilder('d')
      .where('d.user_id = :userId', { userId })
      .andWhere('d.is_deleted = false');

    if (domain) query.andWhere('d.domain = :domain', { domain });

    const total = await query.getCount();
    const data = await query
      .orderBy('d.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const ds = await this.datasetRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!ds) throw { status: 404, code: 'DATASET_NOT_FOUND', message: 'Dataset not found' };
    return ds;
  }

  async create(data: Partial<Dataset>, userId: string) {
    const ds = this.datasetRepo.create({ ...data, user_id: userId });
    return this.datasetRepo.save(ds);
  }

  async update(id: string, data: Partial<Dataset>, userId: string) {
    const ds = await this.getById(id, userId);
    Object.assign(ds, data);
    return this.datasetRepo.save(ds);
  }

  async delete(id: string, userId: string) {
    const ds = await this.getById(id, userId);
    ds.is_deleted = true;
    await this.datasetRepo.save(ds);
    return { success: true };
  }
}
