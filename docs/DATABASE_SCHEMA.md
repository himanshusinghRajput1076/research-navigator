# Database Schema - Himanshu Research Discovery Lab

## 📐 Schema Overview

This document outlines the complete PostgreSQL schema for the Research OS platform.

### Design Principles
- **UUID Primary Keys**: For distributed systems
- **Timestamps**: created_at, updated_at for audit trail
- **Soft Deletes**: is_deleted for data recovery
- **Indexing**: On frequently queried columns
- **Full-Text Search**: PostgreSQL tsvector for paper search
- **JSON Fields**: For flexible metadata storage
- **Relationships**: Full referential integrity

---

## 📋 Table Definitions

### 1. USERS
Store user accounts and profiles.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    country VARCHAR(100),
    bio TEXT,
    orcid_id VARCHAR(50),
    github_username VARCHAR(255),
    research_interests TEXT[], -- Array of interests
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

---

### 2. RESEARCH_FIELDS
Top-level research domains (AI, Cybersecurity, IoT, etc.)

```sql
CREATE TABLE research_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly: "ai-machine-learning"
    description TEXT,
    color VARCHAR(7), -- Hex color for UI
    icon VARCHAR(50), -- Icon name
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}' -- Extensible metadata
);

CREATE INDEX idx_fields_slug ON research_fields(slug);
CREATE INDEX idx_fields_created_by ON research_fields(created_by);
```

---

### 3. RESEARCH_SUBFIELDS
Specialized areas within fields (Deep Learning, NLP, etc.)

```sql
CREATE TABLE research_subfields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id UUID NOT NULL REFERENCES research_fields(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_subfields_field_id ON research_subfields(field_id);
CREATE INDEX idx_subfields_slug ON research_subfields(slug);
CREATE UNIQUE INDEX idx_subfield_unique ON research_subfields(field_id, slug) WHERE is_deleted = FALSE;
```

---

### 4. RESEARCH_PROJECTS
User's research projects (collections of related work)

```sql
CREATE TABLE research_projects (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_projects_user_id ON research_projects(user_id);
CREATE INDEX idx_projects_field_id ON research_projects(field_id);
CREATE INDEX idx_projects_status ON research_projects(status);
```

---

### 5. PAPERS
Academic papers and research documents

```sql
CREATE TABLE papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id),
    title VARCHAR(500) NOT NULL,
    abstract TEXT,
    authors JSONB NOT NULL, -- [{name, email, institution}]
    publication_year INTEGER,
    venue VARCHAR(255), -- Conference/Journal name
    doi VARCHAR(100),
    arxiv_id VARCHAR(50),
    url VARCHAR(500),
    keywords VARCHAR(255)[],
    field_id UUID NOT NULL REFERENCES research_fields(id),
    subfield_id UUID REFERENCES research_subfields(id),
    
    -- Paper metadata
    methodology TEXT,
    datasets JSONB DEFAULT '[]', -- [{name, url, size}]
    algorithms JSONB DEFAULT '[]',
    metrics JSONB DEFAULT '{}',
    results JSONB DEFAULT '{}',
    limitations TEXT,
    future_work TEXT,
    
    -- Reading status: UNREAD, READING, READ, ANALYZED, REPRODUCED, CRITIQUED
    reading_status VARCHAR(50) DEFAULT 'UNREAD',
    importance_score INTEGER DEFAULT 5, -- 1-10 scale
    personal_notes TEXT,
    
    -- PDF metadata
    pdf_url VARCHAR(500),
    pdf_extracted BOOLEAN DEFAULT FALSE,
    
    -- Full-text search
    search_vector tsvector,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    added_from_source VARCHAR(50) -- 'manual', 'arxiv', 'crossref', 'semantic_scholar'
);

CREATE INDEX idx_papers_user_id ON papers(user_id);
CREATE INDEX idx_papers_project_id ON papers(project_id);
CREATE INDEX idx_papers_field_id ON papers(field_id);
CREATE INDEX idx_papers_reading_status ON papers(reading_status);
CREATE INDEX idx_papers_importance ON papers(importance_score);
CREATE INDEX idx_papers_doi ON papers(doi);
CREATE INDEX idx_papers_arxiv ON papers(arxiv_id);
CREATE INDEX idx_papers_search ON papers USING GIN(search_vector);

-- Update tsvector on insert/update
CREATE TRIGGER papers_search_vector_update BEFORE INSERT OR UPDATE ON papers
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.english', title, abstract, keywords);
```

---

### 6. RESEARCHERS
Academic researchers tracked in the system

```sql
CREATE TABLE researchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    added_by UUID NOT NULL REFERENCES users(id),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    source VARCHAR(50) -- 'manual', 'orcid', 'semantic_scholar'
);

CREATE INDEX idx_researchers_name ON researchers(name);
CREATE INDEX idx_researchers_orcid ON researchers(orcid_id);
CREATE INDEX idx_researchers_added_by ON researchers(added_by);
```

---

### 7. PAPER_RESEARCHERS
Junction table for many-to-many relationship

```sql
CREATE TABLE paper_researchers (
    paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    researcher_id UUID NOT NULL REFERENCES researchers(id) ON DELETE CASCADE,
    author_order INTEGER, -- Position in author list
    PRIMARY KEY (paper_id, researcher_id)
);

CREATE INDEX idx_paper_researchers_researcher ON paper_researchers(researcher_id);
```

---

### 8. RESEARCH_PROBLEMS
Problem bank for tracking research questions

```sql
CREATE TABLE research_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    real_world_problem TEXT,
    research_question TEXT,
    why_it_matters TEXT,
    
    -- Status: DISCOVERED, INVESTIGATING, GAP_FOUND, HYPOTHESIS, EXPERIMENTING, VALIDATED, REJECTED, SOLVED, OPEN
    status VARCHAR(50) DEFAULT 'DISCOVERED',
    
    difficulty_level VARCHAR(50), -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    impact_score INTEGER DEFAULT 5, -- 1-10
    novelty_score INTEGER DEFAULT 5,
    
    field_id UUID NOT NULL REFERENCES research_fields(id),
    subfield_id UUID REFERENCES research_subfields(id),
    
    known_limitations TEXT,
    possible_approaches JSONB DEFAULT '[]', -- [{approach, description}]
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_problems_user_id ON research_problems(user_id);
CREATE INDEX idx_problems_project_id ON research_problems(project_id);
CREATE INDEX idx_problems_status ON research_problems(status);
CREATE INDEX idx_problems_field_id ON research_problems(field_id);
```

---

### 9. EXISTING_SOLUTIONS
Known solutions to research problems

```sql
CREATE TABLE existing_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES research_problems(id) ON DELETE CASCADE,
    paper_id UUID REFERENCES papers(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    methodology TEXT,
    algorithm_name VARCHAR(255),
    metrics JSONB DEFAULT '{}',
    results JSONB DEFAULT '{}',
    limitations TEXT,
    source VARCHAR(100), -- Paper DOI or URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_solutions_problem_id ON existing_solutions(problem_id);
CREATE INDEX idx_solutions_paper_id ON existing_solutions(paper_id);
```

---

### 10. RESEARCH_GAPS
Identified gaps in research

```sql
CREATE TABLE research_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES research_problems(id),
    field_id UUID NOT NULL REFERENCES research_fields(id),
    title VARCHAR(500) NOT NULL,
    gap_statement TEXT NOT NULL,
    evidence TEXT,
    gap_status VARCHAR(50) DEFAULT 'POTENTIAL', 
    -- POTENTIAL, NEEDS_VERIFICATION, LIKELY_EXPLORED, STRONGLY_SUPPORTED
    
    known_limitations TEXT,
    what_not_tested TEXT,
    confidence_score INTEGER DEFAULT 5, -- 1-10
    novelty_estimate INTEGER DEFAULT 5,
    impact_estimate INTEGER DEFAULT 5,
    
    supporting_papers JSONB DEFAULT '[]', -- [{paper_id, relevance}]
    contradicting_papers JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_gaps_user_id ON research_gaps(user_id);
CREATE INDEX idx_gaps_problem_id ON research_gaps(problem_id);
CREATE INDEX idx_gaps_field_id ON research_gaps(field_id);
CREATE INDEX idx_gaps_status ON research_gaps(gap_status);
```

---

### 11. HYPOTHESES
Research hypotheses and predictions

```sql
CREATE TABLE hypotheses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id),
    gap_id UUID REFERENCES research_gaps(id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    hypothesis_statement TEXT,
    predicted_outcome TEXT,
    assumptions JSONB DEFAULT '[]',
    
    status VARCHAR(50) DEFAULT 'PROPOSED', -- PROPOSED, TESTING, SUPPORTED, REJECTED, INCONCLUSIVE
    confidence_score INTEGER DEFAULT 5,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_hypotheses_user_id ON hypotheses(user_id);
CREATE INDEX idx_hypotheses_project_id ON hypotheses(project_id);
CREATE INDEX idx_hypotheses_gap_id ON hypotheses(gap_id);
CREATE INDEX idx_hypotheses_status ON hypotheses(status);
```

---

### 12. EXPERIMENTS
Experiment design and execution

```sql
CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id),
    hypothesis_id UUID REFERENCES hypotheses(id),
    problem_id UUID REFERENCES research_problems(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    experiment_status VARCHAR(50) DEFAULT 'DESIGNED', 
    -- DESIGNED, IN_PROGRESS, COMPLETED, FAILED, ON_HOLD
    
    methodology TEXT,
    baseline_method TEXT,
    proposed_method TEXT,
    alternative_methods JSONB DEFAULT '[]',
    
    dataset_id UUID REFERENCES datasets(id),
    code_repository VARCHAR(500),
    environment JSONB DEFAULT '{}', -- {python_version, packages, gpu, etc}
    parameters JSONB DEFAULT '{}',
    
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_experiments_user_id ON experiments(user_id);
CREATE INDEX idx_experiments_project_id ON experiments(project_id);
CREATE INDEX idx_experiments_hypothesis_id ON experiments(hypothesis_id);
CREATE INDEX idx_experiments_status ON experiments(experiment_status);
```

---

### 13. EXPERIMENT_RESULTS
Results and metrics from experiments

```sql
CREATE TABLE experiment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    method_variant VARCHAR(255), -- 'baseline_a', 'baseline_b', 'proposed'
    
    -- Common metrics (nullable, store what's relevant)
    accuracy DECIMAL(5,4),
    precision DECIMAL(5,4),
    recall DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    auc DECIMAL(5,4),
    mse DECIMAL,
    rmse DECIMAL,
    mae DECIMAL,
    
    -- Performance metrics
    latency_ms DECIMAL,
    throughput_rps DECIMAL,
    memory_mb DECIMAL,
    cpu_percent DECIMAL,
    gpu_percent DECIMAL,
    energy_kwh DECIMAL,
    cost_usd DECIMAL,
    
    -- Custom metrics (JSON for flexibility)
    custom_metrics JSONB DEFAULT '{}',
    
    -- Observations and conclusions
    observations TEXT,
    conclusion TEXT,
    reproducibility_status VARCHAR(50), -- REPRODUCIBLE, PARTIALLY, NOT_REPRODUCIBLE
    
    execution_time_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_experiment_results_experiment ON experiment_results(experiment_id);
CREATE INDEX idx_experiment_results_method ON experiment_results(method_variant);
```

---

### 14. DATASETS
Registry of datasets used in research

```sql
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_url VARCHAR(500),
    license VARCHAR(100),
    domain VARCHAR(100), -- 'cybersecurity', 'nlp', etc
    
    size_mb DECIMAL,
    num_samples INTEGER,
    num_features INTEGER,
    
    collection_method TEXT,
    known_limitations TEXT,
    version VARCHAR(50),
    
    citation TEXT,
    doi VARCHAR(100),
    
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_datasets_user_id ON datasets(user_id);
CREATE INDEX idx_datasets_domain ON datasets(domain);
```

---

### 15. ALGORITHMS
Algorithm registry

```sql
CREATE TABLE algorithms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100), -- 'clustering', 'classification', 'optimization'
    
    time_complexity VARCHAR(50), -- 'O(n)', 'O(n log n)', etc
    space_complexity VARCHAR(50),
    
    paper_reference UUID REFERENCES papers(id),
    implementation_url VARCHAR(500),
    
    pros JSONB DEFAULT '[]',
    cons JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_algorithms_user_id ON algorithms(user_id);
CREATE INDEX idx_algorithms_name ON algorithms(name);
CREATE INDEX idx_algorithms_category ON algorithms(category);
```

---

### 16. NOTES
Lab notebook entries

```sql
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id),
    problem_id UUID REFERENCES research_problems(id),
    experiment_id UUID REFERENCES experiments(id),
    paper_id UUID REFERENCES papers(id),
    
    title VARCHAR(500),
    content TEXT NOT NULL,
    note_type VARCHAR(50), -- 'observation', 'hypothesis', 'decision', 'todo', 'general'
    
    tags VARCHAR(255)[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_project_id ON notes(project_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
```

---

### 17. RESEARCH_OUTPUTS
Publishable research outputs

```sql
CREATE TABLE research_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id),
    
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    output_type VARCHAR(50), -- 'paper', 'preprint', 'patent', 'prototype', 'dataset', 'algorithm'
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, IN_PROGRESS, SUBMITTED, PUBLISHED, REJECTED
    
    abstract TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    
    related_problems JSONB DEFAULT '[]', -- [problem_ids]
    related_experiments JSONB DEFAULT '[]', -- [experiment_ids]
    
    repository_url VARCHAR(500),
    paper_url VARCHAR(500),
    doi VARCHAR(100),
    
    submission_date DATE,
    publication_date DATE,
    submission_venue VARCHAR(255),
    
    license VARCHAR(100),
    is_open_source BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_outputs_user_id ON research_outputs(user_id);
CREATE INDEX idx_outputs_project_id ON research_outputs(project_id);
CREATE INDEX idx_outputs_type ON research_outputs(output_type);
CREATE INDEX idx_outputs_status ON research_outputs(status);
```

---

### 18. CITATIONS
Citation tracking and relationships

```sql
CREATE TABLE citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citing_paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    cited_paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    context TEXT, -- Quote or explanation of citation
    citation_type VARCHAR(50), -- 'extends', 'refutes', 'supports', 'uses_method', 'uses_data'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (citing_paper_id, cited_paper_id)
);

CREATE INDEX idx_citations_cited ON citations(cited_paper_id);
```

---

### 19. TAGS
User-defined tags for flexible organization

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

CREATE INDEX idx_tags_user_id ON tags(user_id);
```

---

### 20. ENTITY_TAGS
Junction table for tagging entities

```sql
CREATE TABLE entity_tags (
    entity_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'paper', 'problem', 'experiment', etc
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    
    PRIMARY KEY (entity_id, entity_type, tag_id)
);

CREATE INDEX idx_entity_tags_entity ON entity_tags(entity_id, entity_type);
```

---

### 21. KNOWLEDGE_GRAPH_RELATIONSHIPS
Store relationships for knowledge graph visualization

```sql
CREATE TABLE knowledge_graph_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_entity_id UUID NOT NULL,
    source_entity_type VARCHAR(50) NOT NULL, -- 'paper', 'problem', 'researcher', etc
    
    target_entity_id UUID NOT NULL,
    target_entity_type VARCHAR(50) NOT NULL,
    
    relationship_type VARCHAR(100) NOT NULL, -- 'cites', 'addresses', 'extends', 'contradicts'
    strength DECIMAL(3,2) DEFAULT 1.0, -- 0.0 to 1.0, relationship confidence
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_kgr_source ON knowledge_graph_relationships(source_entity_id, source_entity_type);
CREATE INDEX idx_kgr_target ON knowledge_graph_relationships(target_entity_id, target_entity_type);
```

---

### 22. API_AUDIT_LOG
Track API usage for debugging

```sql
CREATE TABLE api_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    method VARCHAR(10),
    endpoint VARCHAR(500),
    status_code INTEGER,
    response_time_ms INTEGER,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user_id ON api_audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON api_audit_log(created_at DESC);
```

---

## 🔧 Indexes Summary

```sql
-- Papers (most complex table)
idx_papers_user_id
idx_papers_project_id
idx_papers_field_id
idx_papers_reading_status
idx_papers_importance
idx_papers_doi
idx_papers_arxiv
idx_papers_search (FULLTEXT)

-- Research Problems
idx_problems_user_id
idx_problems_project_id
idx_problems_status
idx_problems_field_id

-- Experiments
idx_experiments_user_id
idx_experiments_project_id
idx_experiments_hypothesis_id
idx_experiments_status

-- General Indexes
User IDs (for access control)
Created_at DESC (for sorting)
Status fields (for filtering)
Foreign keys (referential integrity)
```

---

## 🚀 Migration Strategy

### Initial Setup
1. Create all tables
2. Add indexes
3. Add triggers (tsvector updates)
4. Seed initial research fields

### Gradual Migration
For each step, add new tables as needed without dropping existing ones.

---

## 📊 Sample Queries

### Find all papers for a project
```sql
SELECT * FROM papers 
WHERE project_id = $1 AND is_deleted = FALSE
ORDER BY created_at DESC;
```

### Search papers across all fields
```sql
SELECT * FROM papers
WHERE user_id = $1 
AND search_vector @@ to_tsquery('english', $2)
AND is_deleted = FALSE;
```

### Get research evolution for a problem
```sql
SELECT p.title, p.created_at, p.importance_score
FROM papers p
WHERE p.user_id = $1 
AND p.project_id = $2
ORDER BY p.created_at;
```

### Find papers related to a research gap
```sql
SELECT p.* 
FROM papers p
JOIN research_gaps rg ON p.id = ANY(rg.supporting_papers)
WHERE rg.id = $1;
```

---

## ✅ Database Constraints

- NOT NULL on critical fields
- UNIQUE on identifiers (email, slug, DOI, arXiv ID)
- FOREIGN KEYS with CASCADE DELETE where appropriate
- CHECK constraints on enums (status, reading_status)
- CHECK constraints on scores (1-10 range)

---

**Next**: Create TypeORM entities and API contract definitions.
