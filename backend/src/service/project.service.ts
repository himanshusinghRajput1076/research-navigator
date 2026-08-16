import { AppDataSource } from '../database';
import { ResearchProject } from '../entity/ResearchProject';
import { Paper } from '../entity/Paper';
import { ResearchProblem } from '../entity/ResearchProblem';
import { Experiment } from '../entity/Experiment';

export class ProjectService {
  private projectRepo = AppDataSource.getRepository(ResearchProject);
  private paperRepo = AppDataSource.getRepository(Paper);
  private problemRepo = AppDataSource.getRepository(ResearchProblem);
  private experimentRepo = AppDataSource.getRepository(Experiment);

  async getAll(userId: string, page = 1, limit = 20, status?: string) {
    const query = this.projectRepo.createQueryBuilder('p')
      .where('p.user_id = :userId', { userId })
      .andWhere('p.is_deleted = false');

    if (status) query.andWhere('p.status = :status', { status });

    const total = await query.getCount();
    const data = await query
      .orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const project = await this.projectRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!project) throw { status: 404, code: 'PROJECT_NOT_FOUND', message: 'Project not found' };

    const papers = await this.paperRepo.find({ where: { project_id: id, is_deleted: false } });
    const problems = await this.problemRepo.find({ where: { project_id: id, is_deleted: false } });
    const experiments = await this.experimentRepo.find({ where: { project_id: id, is_deleted: false } });

    return {
      ...project,
      papers,
      problems,
      experiments,
    };
  }

  async create(data: Partial<ResearchProject>, userId: string) {
    const project = this.projectRepo.create({ ...data, user_id: userId });
    return this.projectRepo.save(project);
  }

  async update(id: string, data: Partial<ResearchProject>, userId: string) {
    const project = await this.projectRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!project) throw { status: 404, code: 'PROJECT_NOT_FOUND', message: 'Project not found' };
    Object.assign(project, data);
    return this.projectRepo.save(project);
  }

  async delete(id: string, userId: string) {
    const project = await this.projectRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!project) throw { status: 404, code: 'PROJECT_NOT_FOUND', message: 'Project not found' };
    project.is_deleted = true;
    await this.projectRepo.save(project);
    return { success: true };
  }
}
