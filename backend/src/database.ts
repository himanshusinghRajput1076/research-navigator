import 'reflect-metadata';
import { DataSource } from 'typeorm';
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

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
  synchronize: true, // synchronize in dev for automatic table generation
  logging: config.app.env === 'development' ? ['error', 'warn'] : false,
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
  migrations: [],
  subscribers: [],
});
