import { AppDataSource } from '../database';
import { ExistingSolution } from '../entity/ExistingSolution';

export class SolutionService {
  private solutionRepo = AppDataSource.getRepository(ExistingSolution);

  async getByProblem(problemId: string) {
    return this.solutionRepo.find({ where: { problem_id: problemId, is_deleted: false }, order: { created_at: 'DESC' } });
  }

  async create(problemId: string, data: Partial<ExistingSolution>) {
    const solution = this.solutionRepo.create({ ...data, problem_id: problemId });
    return this.solutionRepo.save(solution);
  }

  async update(id: string, data: Partial<ExistingSolution>) {
    const solution = await this.solutionRepo.findOne({ where: { id, is_deleted: false } });
    if (!solution) throw { status: 404, code: 'SOLUTION_NOT_FOUND', message: 'Solution not found' };
    Object.assign(solution, data);
    return this.solutionRepo.save(solution);
  }

  async delete(id: string) {
    const solution = await this.solutionRepo.findOne({ where: { id, is_deleted: false } });
    if (!solution) throw { status: 404, code: 'SOLUTION_NOT_FOUND', message: 'Solution not found' };
    solution.is_deleted = true;
    await this.solutionRepo.save(solution);
    return { success: true };
  }
}
