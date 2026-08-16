import 'reflect-metadata';
import { DataSource, Repository, ObjectLiteral } from 'typeorm';
import { config } from './config';
import { User } from './entity/User';
import { ResearchField } from './entity/ResearchField';
import { ResearchSubfield } from './entity/ResearchSubfield';
import { ResearchProject } from './entity/ResearchProject';
import { Tag } from './entity/Tag';
import { EntityTag } from './entity/EntityTag';
import { Paper } from './entity/Paper';
import { Researcher } from './entity/Researcher';
import { PaperResearcher } from './entity/PaperResearcher';
import { ResearchProblem } from './entity/ResearchProblem';
import { ExistingSolution } from './entity/ExistingSolution';
import { ResearchGap } from './entity/ResearchGap';
import { Hypothesis } from './entity/Hypothesis';
import { Dataset } from './entity/Dataset';
import { Algorithm } from './entity/Algorithm';
import { Experiment } from './entity/Experiment';
import { ExperimentResult } from './entity/ExperimentResult';
import { Note } from './entity/Note';
import { Citation } from './entity/Citation';
import { KnowledgeGraphRelationship } from './entity/KnowledgeGraphRelationship';
import { ResearchOutput } from './entity/ResearchOutput';
import { ApiAuditLog } from './entity/ApiAuditLog';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from './utils/password';
import { logger } from './utils/logger';
import fs from 'fs';
import path from 'path';

// --------------------------------------------------------------------------
// IN-MEMORY DYNAMIC STORE (Active when PostgreSQL is offline)
// --------------------------------------------------------------------------
class InMemoryStore {
  private tables = new Map<string, any[]>();

  constructor() {
    this.seedDefaultData();
  }

  getTable(name: string): any[] {
    if (!this.tables.has(name)) {
      this.tables.set(name, []);
    }
    return this.tables.get(name)!;
  }

  async seedDefaultData() {
    const adminId = '11111111-1111-1111-1111-111111111111';
    const pwdHash = await hashPassword('Admin123!');

    // Users
    const users = this.getTable('users');
    if (users.length === 0) {
      users.push({
        id: adminId,
        email: 'admin@research-os.dev',
        password_hash: pwdHash,
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
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      });
    }

    // Resolve seed_data.json path
    const candidatePaths = [
      path.join(__dirname, 'seeds', 'seed_data.json'),
      path.join(__dirname, '..', 'src', 'seeds', 'seed_data.json'),
      path.join(process.cwd(), 'src', 'seeds', 'seed_data.json'),
      path.join(process.cwd(), 'backend', 'src', 'seeds', 'seed_data.json'),
      path.join(process.cwd(), 'dist', 'seeds', 'seed_data.json'),
    ];

    let seedFilePath: string | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        seedFilePath = p;
        break;
      }
    }

    if (seedFilePath) {
      try {
        const raw = fs.readFileSync(seedFilePath, 'utf-8');
        const data = JSON.parse(raw);

        // Fields & Subfields
        const fields = this.getTable('research_fields');
        const subfields = this.getTable('research_subfields');
        for (const f of data.fields || []) {
          fields.push({
            id: f.id,
            name: f.name,
            slug: f.slug,
            color: f.color,
            icon: f.icon,
            description: f.description,
            created_by: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
          for (const s of f.subfields || []) {
            subfields.push({
              id: uuidv4(),
              field_id: f.id,
              name: s.name,
              slug: s.slug,
              description: `Subfield for ${f.name}`,
              created_by: adminId,
              created_at: new Date(),
              updated_at: new Date(),
              is_deleted: false,
            });
          }
        }

        // Researchers
        const researchers = this.getTable('researchers');
        for (const r of data.researchers || []) {
          researchers.push({
            ...r,
            added_by: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        // Papers
        const papers = this.getTable('papers');
        for (const p of data.papers || []) {
          papers.push({
            ...p,
            user_id: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        // Problems
        const problems = this.getTable('research_problems');
        for (const pr of data.problems || []) {
          problems.push({
            ...pr,
            user_id: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        // Solutions
        const solutions = this.getTable('existing_solutions');
        for (const sol of data.solutions || []) {
          solutions.push({
            ...sol,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        // Gaps
        const gaps = this.getTable('research_gaps');
        for (const g of data.gaps || []) {
          gaps.push({
            ...g,
            user_id: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        // Hypotheses
        const hypotheses = this.getTable('hypotheses');
        for (const h of data.hypotheses || []) {
          hypotheses.push({
            ...h,
            user_id: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        // Experiments
        const experiments = this.getTable('experiments');
        for (const exp of data.experiments || []) {
          experiments.push({
            ...exp,
            user_id: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        // Datasets
        const datasets = this.getTable('datasets');
        for (const ds of data.datasets || []) {
          datasets.push({
            ...ds,
            user_id: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        // Algorithms
        const algorithms = this.getTable('algorithms');
        for (const al of data.algorithms || []) {
          algorithms.push({
            ...al,
            user_id: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        // Notes
        const notes = this.getTable('notes');
        for (const n of data.notes || []) {
          notes.push({
            ...n,
            user_id: adminId,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          });
        }

        logger.info(
          `Successfully loaded ${papers.length} landmark papers, ${researchers.length} scientists, ${problems.length} problems, ${gaps.length} research gaps, ${datasets.length} benchmark datasets, and ${algorithms.length} algorithms into dynamic store.`
        );
      } catch (err: any) {
        logger.warn(`Failed loading seed_data.json: ${err.message}`);
      }
    } else {
      logger.warn('seed_data.json path could not be resolved.');
    }
  }
}

export const inMemoryStore = new InMemoryStore();

// --------------------------------------------------------------------------
// MOCK REPOSITORY FACTORY
// --------------------------------------------------------------------------
function createMockRepository<T extends ObjectLiteral>(entityClass: any): Repository<T> {
  const tableMap: Record<string, string> = {
    User: 'users',
    ResearchField: 'research_fields',
    ResearchSubfield: 'research_subfields',
    ResearchProject: 'research_projects',
    Tag: 'tags',
    EntityTag: 'entity_tags',
    Paper: 'papers',
    Researcher: 'researchers',
    PaperResearcher: 'paper_researchers',
    ResearchProblem: 'research_problems',
    ExistingSolution: 'existing_solutions',
    ResearchGap: 'research_gaps',
    Hypothesis: 'hypotheses',
    Dataset: 'datasets',
    Algorithm: 'algorithms',
    Experiment: 'experiments',
    ExperimentResult: 'experiment_results',
    Note: 'notes',
    Citation: 'citations',
    KnowledgeGraphRelationship: 'knowledge_graph_relationships',
    ResearchOutput: 'research_outputs',
    ApiAuditLog: 'api_audit_log',
  };

  const actualTable =
    tableMap[entityClass.name] ||
    entityClass.name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '') + 's';

  const mockRepo = {
    create(data?: any): any {
      return {
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        ...data,
      };
    },

    async save(item: any): Promise<any> {
      const table = inMemoryStore.getTable(actualTable);
      if (!item.id) item.id = uuidv4();
      item.updated_at = new Date();
      if (!item.created_at) item.created_at = new Date();

      const idx = table.findIndex((r) => r.id === item.id);
      if (idx >= 0) {
        table[idx] = { ...table[idx], ...item };
        return table[idx];
      } else {
        table.push(item);
        return item;
      }
    },

    async find(options?: any): Promise<any[]> {
      const table = inMemoryStore.getTable(actualTable);
      let list = [...table];

      if (options?.where) {
        list = list.filter((item) => {
          return Object.entries(options.where).every(([k, v]) => {
            if (v === undefined) return true;
            return item[k] === v;
          });
        });
      }

      if (options?.take) {
        list = list.slice(0, options.take);
      }

      return list;
    },

    async findOne(options?: any): Promise<any | null> {
      const results = await this.find(options);
      return results[0] || null;
    },

    async count(options?: any): Promise<number> {
      const results = await this.find(options);
      return results.length;
    },

    createQueryBuilder(alias: string) {
      let whereClauses: Array<{ field: string; op: string; val: any }> = [];
      let limitCount = 50;
      let offsetCount = 0;

      const qb: any = {
        where(clause: string, params: any) {
          Object.entries(params || {}).forEach(([k, v]) => {
            whereClauses.push({ field: k, op: 'eq', val: v });
          });
          return qb;
        },
        andWhere(clause: string, params: any) {
          Object.entries(params || {}).forEach(([k, v]) => {
            if (clause.includes('ILIKE')) {
              whereClauses.push({ field: k, op: 'ilike', val: v });
            } else {
              whereClauses.push({ field: k, op: 'eq', val: v });
            }
          });
          return qb;
        },
        orderBy(field: string, dir = 'ASC') {
          return qb;
        },
        addOrderBy(field: string, dir = 'ASC') {
          return qb;
        },
        skip(n: number) {
          offsetCount = n;
          return qb;
        },
        take(n: number) {
          limitCount = n;
          return qb;
        },
        async getCount() {
          const table = inMemoryStore.getTable(actualTable);
          return table.filter((r) => !r.is_deleted).length;
        },
        async getMany() {
          const table = inMemoryStore.getTable(actualTable);
          let res = table.filter((r) => !r.is_deleted);

          // Apply filters
          for (const w of whereClauses) {
            if (w.op === 'ilike' && typeof w.val === 'string') {
              const cleanVal = w.val.replace(/%/g, '').toLowerCase();
              res = res.filter((r) =>
                Object.values(r).some((v) => typeof v === 'string' && v.toLowerCase().includes(cleanVal))
              );
            }
          }

          return res.slice(offsetCount, offsetCount + limitCount);
        },
      };

      return qb;
    },
  };

  return mockRepo as unknown as Repository<T>;
}

// --------------------------------------------------------------------------
// TYPEORM DATASOURCE DEFINITION
// --------------------------------------------------------------------------
const realDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: false,
  entities: [
    User,
    ResearchField,
    ResearchSubfield,
    ResearchProject,
    Tag,
    EntityTag,
    Paper,
    Researcher,
    PaperResearcher,
    ResearchProblem,
    ExistingSolution,
    ResearchGap,
    Hypothesis,
    Dataset,
    Algorithm,
    Experiment,
    ExperimentResult,
    Note,
    Citation,
    KnowledgeGraphRelationship,
    ResearchOutput,
    ApiAuditLog,
  ],
});

export let isUsingMockStore = false;

export const AppDataSource = new Proxy(realDataSource, {
  get(target, prop) {
    if (prop === 'getRepository') {
      return (entity: any) => {
        if (isUsingMockStore || !target.isInitialized) {
          return createMockRepository(entity);
        }
        return target.getRepository(entity);
      };
    }
    if (prop === 'initialize') {
      return async () => {
        try {
          logger.info('Attempting connection to PostgreSQL...');
          const ds = await target.initialize();
          logger.info('Connected to PostgreSQL database successfully.');
          return ds;
        } catch (error: any) {
          logger.warn(`PostgreSQL unreachable: ${error.message}`);
          logger.info('Activating Dynamic In-Memory Research OS Database Engine with comprehensive pre-seeded scientific dataset.');
          isUsingMockStore = true;
          return target;
        }
      };
    }
    return (target as any)[prop];
  },
});
