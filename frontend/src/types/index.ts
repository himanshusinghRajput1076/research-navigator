export type ReadingStatus = 'UNREAD' | 'READING' | 'READ' | 'ANALYZED' | 'REPRODUCED' | 'CRITIQUED' | 'unread' | 'reading' | 'completed';

export type ProblemStatus =
  | 'DISCOVERED'
  | 'INVESTIGATING'
  | 'GAP_FOUND'
  | 'HYPOTHESIS'
  | 'EXPERIMENTING'
  | 'VALIDATED'
  | 'REJECTED'
  | 'SOLVED'
  | 'OPEN'
  | 'identified'
  | 'exploring'
  | 'solved'
  | 'abandoned';

export type GapStatus =
  | 'POTENTIAL'
  | 'NEEDS_VERIFICATION'
  | 'LIKELY_EXPLORED'
  | 'STRONGLY_SUPPORTED'
  | 'potential'
  | 'verified'
  | 'addressed';

export type HypothesisStatus = 'PROPOSED' | 'TESTING' | 'SUPPORTED' | 'REJECTED' | 'INCONCLUSIVE' | 'draft' | 'validated';

export type ExperimentStatus = 'DESIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'ON_HOLD' | 'planned' | 'running';

export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED' | 'planning' | 'on-hold';

export type OutputType = 'paper' | 'preprint' | 'patent' | 'prototype' | 'dataset' | 'algorithm' | 'code' | 'model';

export type OutputStatus = 'DRAFT' | 'IN_PROGRESS' | 'SUBMITTED' | 'PUBLISHED' | 'REJECTED' | 'draft' | 'submitted' | 'published';

export type NoteType = 'observation' | 'hypothesis' | 'decision' | 'todo' | 'general';

export type CitationType = 'extends' | 'refutes' | 'supports' | 'uses_method' | 'uses_data' | 'uses';

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'easy' | 'medium' | 'hard' | 'unsolved';

export type UserRole = 'ADMIN' | 'RESEARCHER' | 'VIEWER' | 'admin' | 'researcher' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  institution?: string;
  country?: string;
  bio?: string;
  orcid_id?: string;
  orcid?: string;
  github_username?: string;
  research_interests?: string[];
  role: UserRole;
  created_at?: string;
}

export interface ResearchField {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  subfields?: ResearchSubfield[];
}

export interface ResearchSubfield {
  id: string;
  field_id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Paper {
  id: string;
  title: string;
  abstract?: string;
  authors: any;
  publication_year?: number;
  year?: number;
  venue?: string;
  doi?: string;
  arxiv_id?: string;
  arxivId?: string;
  url?: string;
  keywords?: string[];
  field_id?: string;
  fieldId?: string;
  subfield_id?: string;
  methodology?: string;
  datasets?: any[];
  algorithms?: string[];
  metrics?: Record<string, any>;
  results?: Record<string, any>;
  limitations?: string;
  future_work?: string;
  reading_status?: ReadingStatus;
  status?: any;
  importance_score?: number;
  importance?: number;
  personal_notes?: string;
  pdf_url?: string;
  created_at?: string;
}

export interface ResearchProject {
  id: string;
  user_id?: string;
  field_id?: string;
  fieldId?: string;
  subfield_id?: string;
  title: string;
  description?: string;
  status?: ProjectStatus;
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  hypothesis?: string;
  papers?: Paper[];
  problems?: ResearchProblem[];
  experiments?: Experiment[];
  created_at?: string;
}

export type Project = ResearchProject;

export interface ResearchProblem {
  id: string;
  user_id?: string;
  project_id?: string;
  title: string;
  description: string;
  real_world_problem?: string;
  research_question?: string;
  why_it_matters?: string;
  status?: ProblemStatus;
  difficulty_level?: DifficultyLevel;
  difficulty?: any;
  impact_score?: number;
  impact?: number;
  novelty_score?: number;
  novelty?: number;
  field_id?: string;
  fieldId?: string;
  solutions?: ExistingSolution[];
  gaps?: ResearchGap[];
  created_at?: string;
}

export type Problem = ResearchProblem;

export interface ExistingSolution {
  id: string;
  problem_id: string;
  paper_id?: string;
  title: string;
  description?: string;
  methodology?: string;
  algorithm_name?: string;
  metrics?: Record<string, any>;
  results?: Record<string, any>;
  limitations?: string;
}

export interface ResearchGap {
  id: string;
  user_id?: string;
  problem_id?: string;
  field_id: string;
  fieldId?: string;
  title: string;
  gap_statement: string;
  description?: string;
  evidence?: string;
  gap_status?: GapStatus;
  status?: any;
  known_limitations?: string;
  what_not_tested?: string;
  confidence_score?: number;
  confidence?: number;
  novelty_estimate?: number;
  novelty?: number;
  impact_estimate?: number;
  impact?: number;
  supporting_papers?: any[];
  contradicting_papers?: any[];
  created_at?: string;
}

export type Gap = ResearchGap;

export interface Hypothesis {
  id: string;
  user_id?: string;
  project_id?: string;
  gap_id?: string;
  hypothesisId?: string;
  title: string;
  description: string;
  hypothesis_statement?: string;
  predicted_outcome?: string;
  assumptions?: string[];
  status?: HypothesisStatus;
  confidence_score?: number;
  created_at?: string;
}

export interface Experiment {
  id: string;
  user_id?: string;
  project_id?: string;
  hypothesis_id?: string;
  hypothesisId?: string;
  problem_id?: string;
  title: string;
  description?: string;
  experiment_status?: ExperimentStatus;
  status?: any;
  methodology?: string;
  baseline_method?: string;
  proposed_method?: string;
  alternative_methods?: string[];
  dataset_id?: string;
  datasetId?: string;
  code_repository?: string;
  environment?: Record<string, any>;
  parameters?: Record<string, any>;
  results?: ExperimentResult[];
  created_at?: string;
}

export interface ExperimentResult {
  id: string;
  experiment_id: string;
  method_variant?: string;
  accuracy?: number;
  precision_score?: number;
  recall?: number;
  f1_score?: number;
  auc?: number;
  latency_ms?: number;
  memory_mb?: number;
  cpu_percent?: number;
  gpu_percent?: number;
  energy_kwh?: number;
  cost_usd?: number;
  custom_metrics?: Record<string, any>;
  observations?: string;
  conclusion?: string;
  reproducibility_status?: string;
  created_at?: string;
}

export interface Researcher {
  id: string;
  name: string;
  institution?: string;
  country?: string;
  research_areas?: string[];
  orcid_id?: string;
  orcid?: string;
  google_scholar_url?: string;
  h_index?: number;
  hIndex?: number;
  total_citations?: number;
  citations?: number;
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  source_url?: string;
  license?: string;
  domain?: string;
  size_mb?: number;
  size?: any;
  num_samples?: number;
  samples?: number;
  num_features?: number;
  features?: number;
}

export interface Algorithm {
  id: string;
  name: string;
  description?: string;
  category?: string;
  time_complexity?: string;
  timeComplexity?: string;
  space_complexity?: string;
  spaceComplexity?: string;
  implementation_url?: string;
}

export interface Note {
  id: string;
  user_id?: string;
  title?: string;
  content: string;
  note_type?: NoteType;
  type?: any;
  tags?: string[];
  created_at?: string;
  createdAt?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: string;
  field_id?: string;
  gap_status?: string;
  reading_status?: string;
  difficulty?: string;
  domain?: string;
  category?: string;
  note_type?: string;
}
