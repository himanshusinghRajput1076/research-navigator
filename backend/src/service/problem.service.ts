import { AppDataSource } from '../database';
import { ResearchProblem } from '../entity/ResearchProblem';
import { ExistingSolution } from '../entity/ExistingSolution';
import { ResearchGap } from '../entity/ResearchGap';

export class ProblemService {
  private problemRepo = AppDataSource.getRepository(ResearchProblem);
  private solutionRepo = AppDataSource.getRepository(ExistingSolution);
  private gapRepo = AppDataSource.getRepository(ResearchGap);

  async getAll(userId: string, page = 1, limit = 20, filters?: { status?: string; field_id?: string; difficulty?: string }) {
    const query = this.problemRepo.createQueryBuilder('p')
      .where('p.user_id = :userId', { userId })
      .andWhere('p.is_deleted = false');

    if (filters?.status) query.andWhere('p.status = :status', { status: filters.status });
    if (filters?.field_id) query.andWhere('p.field_id = :fieldId', { fieldId: filters.field_id });
    if (filters?.difficulty) query.andWhere('p.difficulty_level = :diff', { diff: filters.difficulty });

    const total = await query.getCount();
    const data = await query
      .orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const problem = await this.problemRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!problem) throw { status: 404, code: 'PROBLEM_NOT_FOUND', message: 'Problem not found' };

    const solutions = await this.solutionRepo.find({ where: { problem_id: id, is_deleted: false } });
    const gaps = await this.gapRepo.find({ where: { problem_id: id, is_deleted: false } });

    return { ...problem, solutions, gaps };
  }

  async create(data: Partial<ResearchProblem>, userId: string) {
    const problem = this.problemRepo.create({ ...data, user_id: userId });
    return this.problemRepo.save(problem);
  }

  async update(id: string, data: Partial<ResearchProblem>, userId: string) {
    const problem = await this.problemRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!problem) throw { status: 404, code: 'PROBLEM_NOT_FOUND', message: 'Problem not found' };
    Object.assign(problem, data);
    return this.problemRepo.save(problem);
  }

  async delete(id: string, userId: string) {
    const problem = await this.problemRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!problem) throw { status: 404, code: 'PROBLEM_NOT_FOUND', message: 'Problem not found' };
    problem.is_deleted = true;
    await this.problemRepo.save(problem);
    return { success: true };
  }
}
