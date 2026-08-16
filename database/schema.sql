-- ==============================================================================
-- Research OS - Master PostgreSQL Database Schema (22 Normalized Tables)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION DOMAIN
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    country VARCHAR(100),
    bio TEXT,
    orcid_id VARCHAR(50),
    github_username VARCHAR(255),
    research_interests TEXT[],
    role VARCHAR(50) DEFAULT 'RESEARCHER', -- 'ADMIN', 'RESEARCHER', 'VIEWER'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ------------------------------------------------------------------------------
-- 2. RESEARCH TAXONOMY & PROJECT DOMAIN
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS research_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    icon VARCHAR(50),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_fields_slug ON research_fields(slug);
CREATE INDEX IF NOT EXISTS idx_fields_created_by ON research_fields(created_by);

CREATE TABLE IF NOT EXISTS research_subfields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID NOT NULL REFERENCES research_fields(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_subfields_field_id ON research_subfields(field_id);
CREATE INDEX IF NOT EXISTS idx_subfields_slug ON research_subfields(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subfield_unique ON research_subfields(field_id, slug) WHERE is_deleted = FALSE;

CREATE TABLE IF NOT EXISTS research_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    field_id UUID NOT NULL REFERENCES research_fields(id),
    subfield_id UUID REFERENCES research_subfields(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, COMPLETED, ARCHIVED
    start_date DATE,
    end_date DATE,
    hypothesis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON research_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_field_id ON research_projects(field_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON research_projects(status);

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);

CREATE TABLE IF NOT EXISTS entity_tags (
    entity_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'paper', 'problem', 'experiment', etc.
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (entity_id, entity_type, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_entity_tags_entity ON entity_tags(entity_id, entity_type);

-- ------------------------------------------------------------------------------
-- 3. SCHOLARLY LITERATURE & RESEARCHERS DOMAIN
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    abstract TEXT,
    authors JSONB NOT NULL DEFAULT '[]', -- [{name, email, institution, orcid}]
    publication_year INTEGER,
    venue VARCHAR(255),
    doi VARCHAR(100),
    arxiv_id VARCHAR(50),
    url VARCHAR(500),
    keywords VARCHAR(255)[],
    field_id UUID NOT NULL REFERENCES research_fields(id),
    subfield_id UUID REFERENCES research_subfields(id),
    
    -- Paper analysis metadata
    methodology TEXT,
    datasets JSONB DEFAULT '[]',
    algorithms JSONB DEFAULT '[]',
    metrics JSONB DEFAULT '{}',
    results JSONB DEFAULT '{}',
    limitations TEXT,
    future_work TEXT,
    
    -- Reading status: UNREAD, READING, READ, ANALYZED, REPRODUCED, CRITIQUED
    reading_status VARCHAR(50) DEFAULT 'UNREAD',
    importance_score INTEGER DEFAULT 5, -- 1-10
    personal_notes TEXT,
    
    pdf_url VARCHAR(500),
    pdf_extracted BOOLEAN DEFAULT FALSE,
    
    search_vector tsvector,
    
    added_from_source VARCHAR(50) DEFAULT 'manual', -- 'manual', 'arxiv', 'crossref', 'semantic_scholar', 'openalex'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_papers_user_id ON papers(user_id);
CREATE INDEX IF NOT EXISTS idx_papers_project_id ON papers(project_id);
CREATE INDEX IF NOT EXISTS idx_papers_field_id ON papers(field_id);
CREATE INDEX IF NOT EXISTS idx_papers_reading_status ON papers(reading_status);
CREATE INDEX IF NOT EXISTS idx_papers_importance ON papers(importance_score);
CREATE INDEX IF NOT EXISTS idx_papers_doi ON papers(doi);
CREATE INDEX IF NOT EXISTS idx_papers_arxiv ON papers(arxiv_id);
CREATE INDEX IF NOT EXISTS idx_papers_search ON papers USING GIN(search_vector);

-- Trigger for tsvector full-text search
CREATE OR REPLACE FUNCTION papers_tsvector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('pg_catalog.english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('pg_catalog.english', coalesce(NEW.abstract, '')), 'B') ||
        setweight(to_tsvector('pg_catalog.english', coalesce(array_to_string(NEW.keywords, ' '), '')), 'C') ||
        setweight(to_tsvector('pg_catalog.english', coalesce(NEW.methodology, '')), 'D');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS papers_search_vector_update ON papers;
CREATE TRIGGER papers_search_vector_update BEFORE INSERT OR UPDATE ON papers
FOR EACH ROW EXECUTE FUNCTION papers_tsvector_update();

CREATE TABLE IF NOT EXISTS researchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    added_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    country VARCHAR(100),
    research_areas VARCHAR(255)[],
    orcid_id VARCHAR(50) UNIQUE,
    google_scholar_url VARCHAR(500),
    semantic_scholar_id VARCHAR(100),
    personal_website VARCHAR(500),
    github_username VARCHAR(255),
    h_index INTEGER,
    total_citations INTEGER,
    metadata JSONB DEFAULT '{}',
    source VARCHAR(50) DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_researchers_name ON researchers(name);
CREATE INDEX IF NOT EXISTS idx_researchers_orcid ON researchers(orcid_id);
CREATE INDEX IF NOT EXISTS idx_researchers_added_by ON researchers(added_by);

CREATE TABLE IF NOT EXISTS paper_researchers (
    paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    researcher_id UUID NOT NULL REFERENCES researchers(id) ON DELETE CASCADE,
    author_order INTEGER DEFAULT 1,
    PRIMARY KEY (paper_id, researcher_id)
);

CREATE INDEX IF NOT EXISTS idx_paper_researchers_researcher ON paper_researchers(researcher_id);

CREATE TABLE IF NOT EXISTS citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citing_paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    cited_paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    context TEXT,
    citation_type VARCHAR(50) DEFAULT 'supports', -- 'extends', 'refutes', 'supports', 'uses_method', 'uses_data'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(citing_paper_id, cited_paper_id)
);

CREATE INDEX IF NOT EXISTS idx_citations_cited ON citations(cited_paper_id);

-- ------------------------------------------------------------------------------
-- 4. PROBLEM BANK & SOLUTION REGISTRY
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS research_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    real_world_problem TEXT,
    research_question TEXT,
    why_it_matters TEXT,
    status VARCHAR(50) DEFAULT 'DISCOVERED', -- DISCOVERED, INVESTIGATING, GAP_FOUND, HYPOTHESIS, EXPERIMENTING, VALIDATED, REJECTED, SOLVED, OPEN
    difficulty_level VARCHAR(50) DEFAULT 'INTERMEDIATE', -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    impact_score INTEGER DEFAULT 5, -- 1-10
    novelty_score INTEGER DEFAULT 5, -- 1-10
    field_id UUID NOT NULL REFERENCES research_fields(id),
    subfield_id UUID REFERENCES research_subfields(id),
    known_limitations TEXT,
    possible_approaches JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_problems_user_id ON research_problems(user_id);
CREATE INDEX IF NOT EXISTS idx_problems_project_id ON research_problems(project_id);
CREATE INDEX IF NOT EXISTS idx_problems_status ON research_problems(status);
CREATE INDEX IF NOT EXISTS idx_problems_field_id ON research_problems(field_id);

CREATE TABLE IF NOT EXISTS existing_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES research_problems(id) ON DELETE CASCADE,
    paper_id UUID REFERENCES papers(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    methodology TEXT,
    algorithm_name VARCHAR(255),
    metrics JSONB DEFAULT '{}',
    results JSONB DEFAULT '{}',
    limitations TEXT,
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_solutions_problem_id ON existing_solutions(problem_id);
CREATE INDEX IF NOT EXISTS idx_solutions_paper_id ON existing_solutions(paper_id);

-- ------------------------------------------------------------------------------
-- 5. RESEARCH GAP ENGINE & HYPOTHESIS LAB
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS research_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES research_problems(id) ON DELETE SET NULL,
    field_id UUID NOT NULL REFERENCES research_fields(id),
    title VARCHAR(500) NOT NULL,
    gap_statement TEXT NOT NULL,
    evidence TEXT,
    gap_status VARCHAR(50) DEFAULT 'POTENTIAL', -- POTENTIAL, NEEDS_VERIFICATION, LIKELY_EXPLORED, STRONGLY_SUPPORTED
    known_limitations TEXT,
    what_not_tested TEXT,
    confidence_score INTEGER DEFAULT 5, -- 1-10
    novelty_estimate INTEGER DEFAULT 5, -- 1-10
    impact_estimate INTEGER DEFAULT 5, -- 1-10
    supporting_papers JSONB DEFAULT '[]', -- [{paper_id, title, relevance}]
    contradicting_papers JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_gaps_user_id ON research_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_gaps_problem_id ON research_gaps(problem_id);
CREATE INDEX IF NOT EXISTS idx_gaps_field_id ON research_gaps(field_id);
CREATE INDEX IF NOT EXISTS idx_gaps_status ON research_gaps(gap_status);

CREATE TABLE IF NOT EXISTS hypotheses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    gap_id UUID REFERENCES research_gaps(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    hypothesis_statement TEXT,
    predicted_outcome TEXT,
    assumptions JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'PROPOSED', -- PROPOSED, TESTING, SUPPORTED, REJECTED, INCONCLUSIVE
    confidence_score INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_hypotheses_user_id ON hypotheses(user_id);
CREATE INDEX IF NOT EXISTS idx_hypotheses_project_id ON hypotheses(project_id);
CREATE INDEX IF NOT EXISTS idx_hypotheses_gap_id ON hypotheses(gap_id);
CREATE INDEX IF NOT EXISTS idx_hypotheses_status ON hypotheses(status);

-- ------------------------------------------------------------------------------
-- 6. DATASET & ALGORITHM REGISTRIES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_url VARCHAR(500),
    license VARCHAR(100),
    domain VARCHAR(100),
    size_mb DECIMAL,
    num_samples INTEGER,
    num_features INTEGER,
    collection_method TEXT,
    known_limitations TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    citation TEXT,
    doi VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_datasets_user_id ON datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_datasets_domain ON datasets(domain);

CREATE TABLE IF NOT EXISTS algorithms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'clustering', 'classification', 'anomaly_detection', etc.
    time_complexity VARCHAR(50),
    space_complexity VARCHAR(50),
    paper_reference UUID REFERENCES papers(id) ON DELETE SET NULL,
    implementation_url VARCHAR(500),
    pros JSONB DEFAULT '[]',
    cons JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_algorithms_user_id ON algorithms(user_id);
CREATE INDEX IF NOT EXISTS idx_algorithms_name ON algorithms(name);
CREATE INDEX IF NOT EXISTS idx_algorithms_category ON algorithms(category);

-- ------------------------------------------------------------------------------
-- 7. EXPERIMENT LAB & MULTI-METRIC BENCHMARKING
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    hypothesis_id UUID REFERENCES hypotheses(id) ON DELETE SET NULL,
    problem_id UUID REFERENCES research_problems(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    experiment_status VARCHAR(50) DEFAULT 'DESIGNED', -- DESIGNED, IN_PROGRESS, COMPLETED, FAILED, ON_HOLD
    methodology TEXT,
    baseline_method TEXT,
    proposed_method TEXT,
    alternative_methods JSONB DEFAULT '[]',
    dataset_id UUID REFERENCES datasets(id) ON DELETE SET NULL,
    code_repository VARCHAR(500),
    environment JSONB DEFAULT '{}',
    parameters JSONB DEFAULT '{}',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_experiments_user_id ON experiments(user_id);
CREATE INDEX IF NOT EXISTS idx_experiments_project_id ON experiments(project_id);
CREATE INDEX IF NOT EXISTS idx_experiments_hypothesis_id ON experiments(hypothesis_id);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON experiments(experiment_status);

CREATE TABLE IF NOT EXISTS experiment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    method_variant VARCHAR(255), -- 'baseline_a', 'baseline_b', 'proposed'
    accuracy DECIMAL(7,4),
    precision_score DECIMAL(7,4),
    recall DECIMAL(7,4),
    f1_score DECIMAL(7,4),
    auc DECIMAL(7,4),
    mse DECIMAL,
    rmse DECIMAL,
    mae DECIMAL,
    latency_ms DECIMAL,
    throughput_rps DECIMAL,
    memory_mb DECIMAL,
    cpu_percent DECIMAL,
    gpu_percent DECIMAL,
    energy_kwh DECIMAL,
    cost_usd DECIMAL,
    custom_metrics JSONB DEFAULT '{}',
    observations TEXT,
    conclusion TEXT,
    reproducibility_status VARCHAR(50) DEFAULT 'REPRODUCIBLE', -- REPRODUCIBLE, PARTIALLY, NOT_REPRODUCIBLE
    execution_time_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_experiment_results_experiment ON experiment_results(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_results_method ON experiment_results(method_variant);

-- ------------------------------------------------------------------------------
-- 8. LAB NOTEBOOK, KNOWLEDGE GRAPH & OUTPUTS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    problem_id UUID REFERENCES research_problems(id) ON DELETE SET NULL,
    experiment_id UUID REFERENCES experiments(id) ON DELETE SET NULL,
    paper_id UUID REFERENCES papers(id) ON DELETE SET NULL,
    title VARCHAR(500),
    content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'observation', -- 'observation', 'hypothesis', 'decision', 'todo', 'general'
    tags VARCHAR(255)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);

CREATE TABLE IF NOT EXISTS knowledge_graph_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_entity_id UUID NOT NULL,
    source_entity_type VARCHAR(50) NOT NULL, -- 'paper', 'problem', 'researcher', 'dataset', 'algorithm', 'gap'
    target_entity_id UUID NOT NULL,
    target_entity_type VARCHAR(50) NOT NULL,
    relationship_type VARCHAR(100) NOT NULL, -- 'cites', 'addresses', 'extends', 'contradicts', 'uses_dataset', 'uses_algorithm'
    strength DECIMAL(3,2) DEFAULT 1.0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kgr_source ON knowledge_graph_relationships(source_entity_id, source_entity_type);
CREATE INDEX IF NOT EXISTS idx_kgr_target ON knowledge_graph_relationships(target_entity_id, target_entity_type);

CREATE TABLE IF NOT EXISTS research_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    output_type VARCHAR(50) DEFAULT 'paper', -- 'paper', 'preprint', 'patent', 'prototype', 'dataset', 'algorithm'
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, IN_PROGRESS, SUBMITTED, PUBLISHED, REJECTED
    abstract TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    related_problems JSONB DEFAULT '[]',
    related_experiments JSONB DEFAULT '[]',
    repository_url VARCHAR(500),
    paper_url VARCHAR(500),
    doi VARCHAR(100),
    submission_date DATE,
    publication_date DATE,
    submission_venue VARCHAR(255),
    license VARCHAR(100),
    is_open_source BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_outputs_user_id ON research_outputs(user_id);
CREATE INDEX IF NOT EXISTS idx_outputs_project_id ON research_outputs(project_id);
CREATE INDEX IF NOT EXISTS idx_outputs_type ON research_outputs(output_type);
CREATE INDEX IF NOT EXISTS idx_outputs_status ON research_outputs(status);

-- ------------------------------------------------------------------------------
-- 9. SYSTEM AUDIT LOGGING
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS api_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    method VARCHAR(10),
    endpoint VARCHAR(500),
    status_code INTEGER,
    response_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON api_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON api_audit_log(created_at DESC);
