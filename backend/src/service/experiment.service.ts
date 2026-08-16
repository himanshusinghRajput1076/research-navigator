import { AppDataSource } from '../database';
import { Experiment } from '../entity/Experiment';
import { ExperimentResult } from '../entity/ExperimentResult';

export class ExperimentService {
  private expRepo = AppDataSource.getRepository(Experiment);
  private resultRepo = AppDataSource.getRepository(ExperimentResult);

  async getAll(userId: string, page = 1, limit = 20, status?: string) {
    const query = this.expRepo.createQueryBuilder('e')
      .where('e.user_id = :userId', { userId })
      .andWhere('e.is_deleted = false');

    if (status) query.andWhere('e.experiment_status = :status', { status });

    const total = await query.getCount();
    const data = await query
      .orderBy('e.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const exp = await this.expRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!exp) throw { status: 404, code: 'EXPERIMENT_NOT_FOUND', message: 'Experiment not found' };
    const results = await this.resultRepo.find({ where: { experiment_id: id }, order: { created_at: 'ASC' } });
    return { ...exp, results };
  }

  async create(data: Partial<Experiment>, userId: string) {
    const exp = this.expRepo.create({ ...data, user_id: userId });
    return this.expRepo.save(exp);
  }

  async update(id: string, data: Partial<Experiment>, userId: string) {
    const exp = await this.expRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!exp) throw { status: 404, code: 'EXPERIMENT_NOT_FOUND', message: 'Experiment not found' };
    Object.assign(exp, data);
    return this.expRepo.save(exp);
  }

  async delete(id: string, userId: string) {
    const exp = await this.expRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!exp) throw { status: 404, code: 'EXPERIMENT_NOT_FOUND', message: 'Experiment not found' };
    exp.is_deleted = true;
    await this.expRepo.save(exp);
    return { success: true };
  }

  async addResult(experimentId: string, data: Partial<ExperimentResult>, userId: string) {
    await this.getById(experimentId, userId);
    const result = this.resultRepo.create({ ...data, experiment_id: experimentId });
    return this.resultRepo.save(result);
  }
}
