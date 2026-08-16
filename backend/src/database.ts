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
        research_interests: ['IoT Security', 'Anomaly Detection', 'RF Fingerprinting', 'Adversarial AI'],
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      });
    }

    // Taxonomy Fields
    const fields = this.getTable('research_fields');
    const subfields = this.getTable('research_subfields');

    if (fields.length === 0) {
      const taxonomy = [
        { id: 'f1', name: 'Computer Science', slug: 'computer-science', color: '#3B82F6', icon: 'Cpu', desc: 'Core computing & algorithmic systems.' },
        { id: 'f2', name: 'Cybersecurity', slug: 'cybersecurity', color: '#EF4444', icon: 'Shield', desc: 'Hardware, network & ML security.' },
        { id: 'f3', name: 'IoT & Embedded Systems', slug: 'iot-embedded-systems', color: '#10B981', icon: 'Radio', desc: 'Smart sensors & edge compute.' },
        { id: 'f4', name: 'Signal & Information Processing', slug: 'signal-information-processing', color: '#8B5CF6', icon: 'Activity', desc: 'DSP & time-series analysis.' },
        { id: 'f5', name: 'Waves / Frequency / Electromagnetics', slug: 'waves-frequency-electromagnetics', color: '#F59E0B', icon: 'Wifi', desc: 'RF fingerprinting & spectrum.' },
        { id: 'f6', name: 'Physics + Computing', slug: 'physics-computing', color: '#6366F1', icon: 'Compass', desc: 'Geomagnetic & quantum simulation.' },
        { id: 'f7', name: 'Mathematics for Research', slug: 'mathematics-for-research', color: '#EC4899', icon: 'Calculator', desc: 'Optimization & graph theory.' },
        { id: 'f8', name: 'Robotics & Autonomous Systems', slug: 'robotics-autonomous-systems', color: '#14B8A6', icon: 'Bot', desc: 'SLAM & multi-agent control.' },
        { id: 'f9', name: 'Emerging / Interdisciplinary', slug: 'emerging-interdisciplinary', color: '#F97316', icon: 'Sparkles', desc: 'Bio-inspired & neuromorphic.' },
      ];

      for (const t of taxonomy) {
        fields.push({
          id: t.id,
          name: t.name,
          slug: t.slug,
          color: t.color,
          icon: t.icon,
          description: t.desc,
          created_by: adminId,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
        });

        subfields.push({
          id: uuidv4(),
          field_id: t.id,
          name: `${t.name} Advanced Research`,
          slug: `${t.slug}-advanced`,
          description: `Frontier research subfield for ${t.name}`,
          created_by: adminId,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
        });
      }
    }

    // Benchmark Datasets
    const datasets = this.getTable('datasets');
    if (datasets.length === 0) {
      datasets.push(
        {
          id: uuidv4(),
          user_id: adminId,
          name: 'N-BaIoT',
          description: 'Network traffic anomaly detection dataset for identifying IoT botnet attacks from 9 commercial IoT devices.',
          domain: 'Cybersecurity / IoT',
          size_mb: 5400,
          num_samples: 7062604,
          num_features: 115,
          license: 'CC BY 4.0',
          source_url: 'https://archive.ics.uci.edu/dataset/442/n+baiot+dataset',
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
        },
        {
          id: uuidv4(),
          user_id: adminId,
          name: 'CICIoT2023',
          description: 'Large-scale real-world IoT attack dataset with 33 attack classes across 105 smart devices.',
          domain: 'Cybersecurity',
          size_mb: 18000,
          num_samples: 46686579,
          num_features: 46,
          license: 'Free for Research',
          source_url: 'https://www.unb.ca/cic/datasets/iot-dataset-2023.html',
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
        },
        {
          id: uuidv4(),
          user_id: adminId,
          name: 'IoTGeM',
          description: 'Geomagnetic anomaly detection dataset for detecting physical tampering of IoT nodes.',
          domain: 'Physics / IoT',
          size_mb: 850,
          num_samples: 1250000,
          num_features: 32,
          license: 'MIT',
          source_url: 'https://github.com/research/iotgem',
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
        }
      );
    }

    // Sample Research Problem
    const problems = this.getTable('research_problems');
    if (problems.length === 0) {
      const probId = uuidv4();
      problems.push({
        id: probId,
        user_id: adminId,
        title: 'Adversarial Robustness in Lightweight IoT Intrusion Detection',
        description: 'Deep neural networks deployed on resource-constrained microcontrollers degrade significantly under slight adversarial perturbations and concept drift in IoT environments.',
        research_question: 'Can lightweight RF physical-layer feature extraction improve anomaly classification accuracy while maintaining <10ms inference latency?',
        why_it_matters: 'IoT edge devices in critical infrastructure require tamper-proof security without battery exhaustion.',
        difficulty_level: 'ADVANCED',
        impact_score: 9,
        novelty_score: 8,
        field_id: 'f2',
        status: 'INVESTIGATING',
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      });

      // Sample Gap
      const gaps = this.getTable('research_gaps');
      gaps.push({
        id: uuidv4(),
        user_id: adminId,
        problem_id: probId,
        field_id: 'f2',
        title: 'Lack of multi-modal RF and network traffic fusion under continuous concept drift',
        gap_statement: 'Existing methods evaluate network packet features and RF physical layers in isolation, missing cross-layer correlations.',
        evidence: 'Literature review of IEEE S&P and ACM CCS papers from 2020-2024 shows zero benchmarks combining N-BaIoT with RF side-channels.',
        confidence_score: 8,
        novelty_estimate: 9,
        impact_estimate: 9,
        gap_status: 'STRONGLY_SUPPORTED',
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      });

      // Sample Papers
      const papers = this.getTable('papers');
      papers.push({
        id: uuidv4(),
        user_id: adminId,
        title: 'Attention Is All You Need',
        abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence.',
        authors: [{ name: 'Ashish Vaswani' }, { name: 'Noam Shazeer' }, { name: 'Niki Parmar' }],
        publication_year: 2017,
        venue: 'NeurIPS',
        reading_status: 'ANALYZED',
        importance_score: 10,
        field_id: 'f1',
        methodology: 'Multi-head self-attention mechanisms with positional encodings.',
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      });
    }
  }
}

export const inMemoryStore = new InMemoryStore();

// --------------------------------------------------------------------------
// MOCK REPOSITORY FACTORY
// --------------------------------------------------------------------------
function createMockRepository<T extends ObjectLiteral>(entityClass: any): Repository<T> {
  const tableName = entityClass.name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '') + 's';
  // Specific entity mapping
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

  const actualTable = tableMap[entityClass.name] || tableName;

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
      let orderField = 'created_at';
      let orderDir = 'DESC';

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
          orderField = field.replace(`${alias}.`, '');
          orderDir = dir;
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

// Proxy DataSource that seamlessly routes getRepository to either PostgreSQL or InMemoryStore
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
          logger.info('Activating Dynamic In-Memory Research OS Database Engine with auto-seeded demo data.');
          isUsingMockStore = true;
          return target;
        }
      };
    }
    return (target as any)[prop];
  },
});
