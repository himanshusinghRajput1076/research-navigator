import { AppDataSource } from '../database';
import { ResearchProject } from '../entity/ResearchProject';
import { Paper } from '../entity/Paper';
import { Researcher } from '../entity/Researcher';
import { ResearchProblem } from '../entity/ResearchProblem';
import { ExistingSolution } from '../entity/ExistingSolution';
import { ResearchGap } from '../entity/ResearchGap';
import { Experiment } from '../entity/Experiment';
import { Dataset } from '../entity/Dataset';

export class DashboardService {
  async getStats(userId: string) {
    const projectRepo = AppDataSource.getRepository(ResearchProject);
    const paperRepo = AppDataSource.getRepository(Paper);
    const researcherRepo = AppDataSource.getRepository(Researcher);
    const problemRepo = AppDataSource.getRepository(ResearchProblem);
    const solutionRepo = AppDataSource.getRepository(ExistingSolution);
    const gapRepo = AppDataSource.getRepository(ResearchGap);
    const experimentRepo = AppDataSource.getRepository(Experiment);
    const datasetRepo = AppDataSource.getRepository(Dataset);

    const [
      projects,
      papers,
      researchers,
      problems,
      solutions,
      gaps,
      experiments,
      datasets,
      recentPapers,
      activeProjects,
    ] = await Promise.all([
      projectRepo.count({ where: { user_id: userId, is_deleted: false } }),
      paperRepo.count({ where: { user_id: userId, is_deleted: false } }),
      researcherRepo.count({ where: { added_by: userId, is_deleted: false } }),
      problemRepo.count({ where: { user_id: userId, is_deleted: false } }),
      solutionRepo.count({ where: { is_deleted: false } }),
      gapRepo.count({ where: { user_id: userId, is_deleted: false } }),
      experimentRepo.count({ where: { user_id: userId, is_deleted: false } }),
      datasetRepo.count({ where: { user_id: userId, is_deleted: false } }),
      paperRepo.find({ where: { user_id: userId, is_deleted: false }, order: { created_at: 'DESC' }, take: 5 }),
      projectRepo.find({ where: { user_id: userId, status: 'ACTIVE', is_deleted: false }, order: { created_at: 'DESC' }, take: 5 }),
    ]);

    return {
      stats: {
        projects,
        papers,
        researchers,
        problems,
        solutions,
        gaps,
        experiments,
        datasets,
      },
      recentPapers,
      activeProjects,
    };
  }
}
