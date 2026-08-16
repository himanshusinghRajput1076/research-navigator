import 'reflect-metadata';
import { AppDataSource } from '../database';
import { User } from '../entity/User';
import { ResearchField } from '../entity/ResearchField';
import { ResearchSubfield } from '../entity/ResearchSubfield';
import { Paper } from '../entity/Paper';
import { Researcher } from '../entity/Researcher';
import { ResearchProblem } from '../entity/ResearchProblem';
import { ExistingSolution } from '../entity/ExistingSolution';
import { ResearchGap } from '../entity/ResearchGap';
import { Hypothesis } from '../entity/Hypothesis';
import { Dataset } from '../entity/Dataset';
import { Algorithm } from '../entity/Algorithm';
import { Experiment } from '../entity/Experiment';
import { Note } from '../entity/Note';
import { hashPassword } from '../utils/password';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

async function seed() {
  try {
    logger.info('Initializing DataSource for comprehensive scientific seeding...');
    await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(User);
    const fieldRepo = AppDataSource.getRepository(ResearchField);
    const subfieldRepo = AppDataSource.getRepository(ResearchSubfield);
    const paperRepo = AppDataSource.getRepository(Paper);
    const resRepo = AppDataSource.getRepository(Researcher);
    const problemRepo = AppDataSource.getRepository(ResearchProblem);
    const solRepo = AppDataSource.getRepository(ExistingSolution);
    const gapRepo = AppDataSource.getRepository(ResearchGap);
    const hypoRepo = AppDataSource.getRepository(Hypothesis);
    const datasetRepo = AppDataSource.getRepository(Dataset);
    const algoRepo = AppDataSource.getRepository(Algorithm);
    const expRepo = AppDataSource.getRepository(Experiment);
    const noteRepo = AppDataSource.getRepository(Note);

    // 1. Admin User
    let admin = await userRepo.findOne({ where: { email: 'admin@research-os.dev' } });
    if (!admin) {
      const password_hash = await hashPassword('Admin123!');
      admin = userRepo.create({
        email: 'admin@research-os.dev',
        password_hash,
        full_name: 'Lead Researcher',
        institution: 'Research Discovery Lab',
        country: 'Global',
        role: 'ADMIN',
        research_interests: [
          'IoT Security',
          'Anomaly Detection',
          'RF Fingerprinting',
          'Adversarial AI',
          'Transformers',
          'SLAM',
        ],
      });
      await userRepo.save(admin);
      logger.info('Seeded default admin: admin@research-os.dev / Admin123!');
    }

    // 2. Load and insert seed data
    const seedPath = path.join(__dirname, 'seed_data.json');
    if (fs.existsSync(seedPath)) {
      const data = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

      // Fields
      for (const f of data.fields || []) {
        let field = await fieldRepo.findOne({ where: { slug: f.slug } });
        if (!field) {
          field = fieldRepo.create({
            id: f.id,
            name: f.name,
            slug: f.slug,
            color: f.color,
            icon: f.icon,
            description: f.description,
            created_by: admin.id,
          });
          await fieldRepo.save(field);
          logger.info(`Seeded Field: ${f.name}`);
        }

        for (const s of f.subfields || []) {
          const existingSub = await subfieldRepo.findOne({ where: { field_id: field.id, slug: s.slug } });
          if (!existingSub) {
            const sub = subfieldRepo.create({
              field_id: field.id,
              name: s.name,
              slug: s.slug,
              created_by: admin.id,
            });
            await subfieldRepo.save(sub);
          }
        }
      }

      // Researchers
      for (const r of data.researchers || []) {
        const existing = await resRepo.findOne({ where: { name: r.name } });
        if (!existing) {
          const res = resRepo.create({ ...r, added_by: admin.id });
          await resRepo.save(res);
          logger.info(`Seeded Researcher: ${r.name}`);
        }
      }

      // Papers
      for (const p of data.papers || []) {
        const existing = await paperRepo.findOne({ where: { title: p.title } });
        if (!existing) {
          const paper = paperRepo.create({ ...p, user_id: admin.id });
          await paperRepo.save(paper);
          logger.info(`Seeded Paper: ${p.title}`);
        }
      }

      // Problems
      for (const pr of data.problems || []) {
        const existing = await problemRepo.findOne({ where: { title: pr.title } });
        if (!existing) {
          const prob = problemRepo.create({ ...pr, user_id: admin.id });
          await problemRepo.save(prob);
          logger.info(`Seeded Problem: ${pr.title}`);
        }
      }

      // Solutions
      for (const sol of data.solutions || []) {
        const existing = await solRepo.findOne({ where: { title: sol.title } });
        if (!existing) {
          const s = solRepo.create(sol);
          await solRepo.save(s);
        }
      }

      // Gaps
      for (const g of data.gaps || []) {
        const existing = await gapRepo.findOne({ where: { title: g.title } });
        if (!existing) {
          const gap = gapRepo.create({ ...g, user_id: admin.id });
          await gapRepo.save(gap);
          logger.info(`Seeded Gap: ${g.title}`);
        }
      }

      // Hypotheses
      for (const h of data.hypotheses || []) {
        const existing = await hypoRepo.findOne({ where: { title: h.title } });
        if (!existing) {
          const hypo = hypoRepo.create({ ...h, user_id: admin.id });
          await hypoRepo.save(hypo);
        }
      }

      // Experiments
      for (const exp of data.experiments || []) {
        const existing = await expRepo.findOne({ where: { title: exp.title } });
        if (!existing) {
          const e = expRepo.create({ ...exp, user_id: admin.id });
          await expRepo.save(e);
          logger.info(`Seeded Experiment: ${exp.title}`);
        }
      }

      // Datasets
      for (const ds of data.datasets || []) {
        const existing = await datasetRepo.findOne({ where: { name: ds.name } });
        if (!existing) {
          const d = datasetRepo.create({ ...ds, user_id: admin.id });
          await datasetRepo.save(d);
          logger.info(`Seeded Dataset: ${ds.name}`);
        }
      }

      // Algorithms
      for (const al of data.algorithms || []) {
        const existing = await algoRepo.findOne({ where: { name: al.name } });
        if (!existing) {
          const a = algoRepo.create({ ...al, user_id: admin.id });
          await algoRepo.save(a);
          logger.info(`Seeded Algorithm: ${al.name}`);
        }
      }

      // Notes
      for (const n of data.notes || []) {
        const existing = await noteRepo.findOne({ where: { title: n.title } });
        if (!existing) {
          const note = noteRepo.create({ ...n, user_id: admin.id });
          await noteRepo.save(note);
        }
      }
    }

    logger.info('Comprehensive scientific database seeding completed successfully.');
    process.exit(0);
  } catch (error: any) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

seed();
