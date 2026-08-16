# Himanshu Research Discovery Lab - Visual Architecture

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + TypeScript)                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │ Dashboard  │  │ Papers Lib │  │ Experiments│  │  Knowledge │    │
│  │            │  │            │  │            │  │   Graph    │    │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │  Problems  │  │   Gaps &   │  │    AI      │  │   Notes    │    │
│  │            │  │ Hypotheses │  │ Assistant  │  │            │    │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘    │
│                                                                       │
│  State: TanStack Query + React Hooks                                 │
│  Styling: Tailwind CSS + Shadcn/ui                                   │
│  Port: http://localhost:5173                                         │
└──────────────┬──────────────────────────────────────────────────────┘
               │
               │ JSON over HTTPS
               │ JWT Authentication
               │
┌──────────────▼──────────────────────────────────────────────────────┐
│                     API GATEWAY & MIDDLEWARE                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ • Authentication                                             │  │
│  │ • Rate Limiting (50 req/min)                                 │  │
│  │ • Input Validation                                           │  │
│  │ • Error Handling                                             │  │
│  │ • CORS Configuration                                         │  │
│  │ • Request Logging                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────────┐
│                 BACKEND API (Express.js + Node.js)                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Authentication Service                                       │  │
│  │  ├─ Register, Login, Profile Management                     │  │
│  │  └─ JWT Token Generation & Validation                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Research Organization Service                               │  │
│  │  ├─ Fields (dynamic, user-extensible)                       │  │
│  │  ├─ Subfields                                               │  │
│  │  └─ Projects (group research work)                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Research Input Service                                      │  │
│  │  ├─ Papers (CRUD, import, search)                           │  │
│  │  ├─ Researchers (ORCID, citations)                          │  │
│  │  ├─ Datasets (versioned registry)                           │  │
│  │  └─ Algorithms (complexity analysis)                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Research Analysis Service                                   │  │
│  │  ├─ Problems (problem bank)                                 │  │
│  │  ├─ Solutions (known approaches)                            │  │
│  │  ├─ Research Gaps (identification & verification)           │  │
│  │  └─ Hypotheses (testable predictions)                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Research Execution Service                                  │  │
│  │  ├─ Experiments (design & execution)                        │  │
│  │  ├─ Results (multi-metric support)                          │  │
│  │  ├─ Lab Notebook (chronological notes)                      │  │
│  │  └─ Citations (paper relationships)                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Search & Knowledge Service                                  │  │
│  │  ├─ Full-Text Search (PostgreSQL)                           │  │
│  │  ├─ Knowledge Graph (relationships)                         │  │
│  │  └─ Entity Linking                                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ AI Research Assistant Service                               │  │
│  │  ├─ Paper Explanation                                       │  │
│  │  ├─ Gap Identification                                      │  │
│  │  ├─ Paper Comparison                                        │  │
│  │  ├─ Hypothesis Generation                                   │  │
│  │  └─ Experiment Suggestion                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ External API Service                                        │  │
│  │  ├─ arXiv Integration                                       │  │
│  │  ├─ Crossref/DOI Integration                                │  │
│  │  ├─ Semantic Scholar Integration                            │  │
│  │  └─ ORCID Integration                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Port: http://localhost:3000                                        │
│  API Docs: http://localhost:3000/api/v1/docs                        │
└──────────────┬──────────────────────────────────────────────────────┘
               │
       ┌───────┼───────┐
       │       │       │
       ▼       ▼       ▼
   ┌────────────────────────────────────────┐
   │   POSTGRESQL DATABASE                  │
   │                                         │
   │   22 Normalized Tables                  │
   │   ├─ Users & Auth                       │
   │   ├─ Research Organization              │
   │   ├─ Research Input                     │
   │   ├─ Research Analysis                  │
   │   ├─ Research Execution                 │
   │   ├─ Knowledge Management               │
   │   └─ Audit Logging                      │
   │                                         │
   │   Full-Text Search Vectors              │
   │   Knowledge Graph Relationships         │
   │   Port: localhost:5432                  │
   └────────────────────────────────────────┘
```

---

## 🔄 Research Workflow

```
                    THE RESEARCH CYCLE
                    ═════════════════════

                         START
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  1️⃣  DISCOVER                    │
        │  - Find papers & research        │
        │  - Identify researchers          │
        │  - Search literature             │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  2️⃣  UNDERSTAND                  │
        │  - Read papers                   │
        │  - Track methodology             │
        │  - Extract key findings          │
        │  - AI explains papers            │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  3️⃣  COMPARE                     │
        │  - Compare solutions             │
        │  - Analyze limitations           │
        │  - Build comparison matrices     │
        │  - Identify patterns             │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  4️⃣  CHALLENGE                   │
        │  - Question assumptions          │
        │  - Identify gaps                 │
        │  - Find contradictions           │
        │  - Verify evidence               │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  5️⃣  FIND GAP                    │
        │  - Formulate gap statement       │
        │  - Score confidence              │
        │  - Estimate novelty & impact     │
        │  - Collect evidence              │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  6️⃣  HYPOTHESIS                  │
        │  - Generate hypotheses           │
        │  - Test predictions              │
        │  - Plan experiments              │
        │  - AI suggests hypotheses        │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  7️⃣  DESIGN SOLUTION             │
        │  - Design experiments            │
        │  - Select baselines              │
        │  - Define metrics                │
        │  - Prepare environment           │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  8️⃣  EXPERIMENT                  │
        │  - Run experiments               │
        │  - Record results                │
        │  - Track metrics                 │
        │  - Document observations         │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  9️⃣  RESULTS                     │
        │  - Analyze results               │
        │  - Compare baselines             │
        │  - Statistical validation        │
        │  - Draw conclusions              │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  🔟  VALIDATE                    │
        │  - Verify hypothesis             │
        │  - Check reproducibility         │
        │  - Document findings             │
        │  - Plan next research            │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  📝  OUTPUT                      │
        │  - Write paper                   │
        │  - Create prototype              │
        │  - Patent idea                   │
        │  - Share findings                │
        └────────┬─────────────────────────┘
                 │
                 ▼
        ┌──────────────────────────────────┐
        │  🔄  NEW PROBLEM                 │
        │  - Findings raise new Q's        │
        │  - Loop back to DISCOVER         │
        │  - Build on findings             │
        └────────────────────────────────┘
                 │
                 └──────► Back to START

  Each step stores in database & links to others
  AI assists at multiple stages
  Knowledge graph builds automatically
```

---

## 📊 Database Entity Relationships

```
                            USERS
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
            PROJECTS      RESEARCH_FIELDS  RESEARCHERS
                │             │
                ├─────────────┬─────────┐
                │             │         │
                ▼             ▼         ▼
             PAPERS    RESEARCH_SUBFIELDS
                │
        ┌───────┼──────────────┬────────────┐
        │       │              │            │
        ▼       ▼              ▼            ▼
    PROBLEMS SOLUTIONS   CITATIONS   PAPER_RESEARCHERS
        │
    ┌───┼────────────┐
    │   │            │
    ▼   ▼            ▼
  GAPS HYPOTHESES DATASETS
    │       │
    ▼       ▼
EXPERIMENTS  → EXPERIMENT_RESULTS
    │
    ▼
  NOTES

Knowledge Graph Relationships: RESEARCHER → PAPER → PROBLEM → SOLUTION → GAP → HYPOTHESIS → EXPERIMENT
```

---

## 🎯 API Endpoint Organization

```
/api/v1/

├── auth/                        (Authentication: 5)
│   ├─ POST   /register
│   ├─ POST   /login
│   ├─ POST   /logout
│   ├─ GET    /me
│   └─ PATCH  /me
│
├── fields/                      (Research Fields: 6)
│   ├─ GET    /                  (list all)
│   ├─ POST   /                  (create)
│   ├─ GET    /:id               (get one)
│   ├─ PATCH  /:id               (update)
│   ├─ GET    /:id/subfields
│   └─ POST   /:id/subfields
│
├── projects/                    (Projects: 5)
│   ├─ GET, POST, GET/:id, PATCH/:id, DELETE/:id
│
├── papers/                      (Papers: 8+)
│   ├─ GET    /                  (list)
│   ├─ POST   /                  (create)
│   ├─ GET    /:id               (get)
│   ├─ PATCH  /:id               (update)
│   ├─ DELETE /:id               (delete)
│   ├─ POST   /import/arxiv      (arXiv import)
│   ├─ POST   /import/crossref   (Crossref import)
│   └─ GET    /:id/citations
│
├── problems/                    (Problems: 5)
│   ├─ GET, POST, GET/:id, PATCH/:id, DELETE/:id
│
├── solutions/                   (Solutions: 4)
│   ├─ GET    /
│   ├─ POST   /
│   ├─ PATCH  /:id
│   └─ DELETE /:id
│
├── gaps/                        (Gaps: 4)
│   ├─ GET, POST, GET/:id, PATCH/:id
│
├── hypotheses/                  (Hypotheses: 4)
│   ├─ GET, POST, GET/:id, PATCH/:id
│
├── experiments/                 (Experiments: 6)
│   ├─ GET    /
│   ├─ POST   /
│   ├─ GET    /:id
│   ├─ PATCH  /:id
│   ├─ POST   /:id/results
│   └─ GET    /:id/comparison
│
├── datasets/                    (Datasets: 4)
│   ├─ GET, POST, GET/:id, DELETE/:id
│
├── algorithms/                  (Algorithms: 4)
│   ├─ GET, POST, GET/:id, DELETE/:id
│
├── notes/                       (Lab Notebook: 5)
│   ├─ GET, POST, GET/:id, PATCH/:id, DELETE/:id
│
├── researchers/                 (Researchers: 4)
│   ├─ GET, POST, GET/:id, DELETE/:id
│
├── citations/                   (Citations: 3)
│   ├─ GET, POST, DELETE
│
├── search/                      (Search: 4)
│   ├─ GET    /?q=query          (global search)
│   ├─ GET    /papers?q=query
│   ├─ GET    /problems?q=query
│   └─ GET    /gaps?q=query
│
└── ai/                          (AI Assistant: 6)
    ├─ POST   /explain-paper
    ├─ POST   /compare-papers
    ├─ POST   /identify-gaps
    ├─ POST   /generate-hypotheses
    ├─ POST   /suggest-experiments
    └─ POST   /extract-methodology

Total: 80+ fully documented endpoints
```

---

## 🧬 Data Model Core

```
RESEARCH WORKFLOW IN DATABASE
════════════════════════════════

1. DISCOVERY PHASE
   Papers → Researchers → Research Fields/Subfields
   
   TABLES: papers, paper_researchers, researchers, research_fields

2. ANALYSIS PHASE
   Papers → Problems → Solutions
   
   TABLES: research_problems, existing_solutions

3. GAP IDENTIFICATION PHASE
   Problems → Research Gaps (with supporting papers)
   
   TABLES: research_gaps, citations

4. HYPOTHESIS PHASE
   Gaps → Hypotheses (predictions to test)
   
   TABLES: hypotheses

5. EXPERIMENTATION PHASE
   Hypotheses → Experiments → Results
   
   TABLES: experiments, experiment_results, datasets

6. OUTPUT PHASE
   Results → Research Outputs (papers, patents, prototypes)
   
   TABLES: research_outputs

7. KNOWLEDGE PHASE
   All entities → Knowledge Graph (for visualization)
   
   TABLES: knowledge_graph_relationships

Throughout:
   - Notes at any stage (lab notebook)
   - Tags for organization
   - Full-text search across everything
   - AI assistance available
```

---

## 10-Step Development Timeline

```
WEEK
├─ 1-2    ║ STEP 1: Database & Architecture
│         ║ ├─ Setup PostgreSQL
│         ║ ├─ Create 22 tables
│         ║ ├─ Add indexes
│         ║ └─ Seed data
│
├─ 2-3    ║ STEP 2: Authentication
│         ║ ├─ JWT login/register
│         ║ ├─ User management
│         ║ └─ Auth middleware
│
├─ 3-4    ║ STEP 3: Research Fields
│         ║ ├─ Dynamic field creation
│         ║ ├─ Subfields
│         ║ └─ Field validation
│
├─ 4-5    ║ STEP 4: Projects
│         ║ └─ Project CRUD
│
├─ 5-7    ║ STEP 5: Paper Library
│         ║ ├─ Paper CRUD
│         ║ ├─ ArXiv/Crossref import
│         ║ └─ Paper search
│
├─ 7-8    ║ STEP 6: Problems & Solutions
│         ║ ├─ Problem bank
│         ║ └─ Solution tracking
│
├─ 8-9    ║ STEP 7: Gaps & Hypotheses
│         ║ ├─ Gap identification
│         ║ └─ Hypothesis generation
│
├─ 9-11   ║ STEP 8: Experiments & Results
│         ║ ├─ Experiment tracking
│         ║ └─ Multi-metric results
│
├─ 11-12  ║ STEP 9: Search & Indexing
│         ║ └─ Full-text search
│
└─ 12     ║ STEP 10: Knowledge Graph & AI
          ║ ├─ Knowledge graph
          ║ └─ Claude AI integration

TOTAL: 8-12 weeks
```

---

## 🔒 Security Layers

```
                    REQUEST FLOW WITH SECURITY
                    ════════════════════════════

User Input (Frontend)
   ↓
   ├─ Client-side validation (React Form validation)
   │
   ▼
HTTPS/TLS Encryption
   │
   ▼
API Gateway
   ├─ CORS Check
   ├─ Rate Limiting (50 req/min)
   ├─ Request Logging
   │
   ▼
Authentication Middleware
   ├─ Extract JWT from Authorization header
   ├─ Verify JWT signature (HS256)
   ├─ Attach user to request
   │
   ▼
Authorization Middleware
   ├─ Check user has access to resource
   ├─ Enforce user data isolation
   │
   ▼
Input Validation Middleware
   ├─ Validate request body (Zod schemas)
   ├─ Type checking
   │
   ▼
Business Logic (Service Layer)
   ├─ Process request
   ├─ Apply business rules
   │
   ▼
ORM Query (TypeORM)
   ├─ Parameterized queries (no SQL injection)
   ├─ Type-safe database operations
   │
   ▼
PostgreSQL Database
   ├─ Foreign key constraints
   ├─ Unique constraints
   │
   ▼
Response Generation
   ├─ Serialize data
   ├─ Remove sensitive fields
   │
   ▼
HTTPS Encryption
   │
   ▼
Frontend
   └─ Display to user


SECURITY MEASURES SUMMARY
═════════════════════════
✅ Password Hashing: bcrypt (cost 12)
✅ JWT Auth: HS256 signature
✅ SQL Injection: ORM parameterized queries
✅ XSS: React auto-escapes content
✅ CSRF: JWT used instead of cookies
✅ CORS: Whitelist localhost:5173
✅ Rate Limiting: 50 req/min/user
✅ Input Validation: Zod schemas
✅ User Isolation: Row-level security
✅ Data Protection: Soft deletes, no hard deletes
✅ Secrets: Environment variables (.env)
✅ Logging: Winston audit trail
```

---

## 📱 Technology Stack Pyramid

```
                        PRESENTATION
                    ┌─────────────────┐
                    │  React 18       │
                    │  TypeScript     │
                    │  Tailwind CSS   │
                    │  Shadcn/UI      │
                    └────────┬────────┘
                             │
                      STATE MANAGEMENT
                    ┌─────────────────┐
                    │ TanStack Query  │
                    │ React Hooks     │
                    │ Context API     │
                    └────────┬────────┘
                             │
                         API LAYER
                    ┌─────────────────┐
                    │  Express.js     │
                    │  REST API       │
                    │  JWT Auth       │
                    │  Middleware     │
                    └────────┬────────┘
                             │
                       BUSINESS LOGIC
                    ┌─────────────────┐
                    │ Services        │
                    │ TypeORM         │
                    │ Repositories    │
                    │ Validators      │
                    └────────┬────────┘
                             │
                        DATABASE LAYER
                    ┌─────────────────┐
                    │ PostgreSQL      │
                    │ 22 Tables       │
                    │ Full-Text Search│
                    │ Indexes         │
                    └─────────────────┘
```

---

## ✨ Project Completion Visualization

```
PROGRESS TO PRODUCTION-READY
═════════════════════════════════════════════════════════════════

STEP 1  [████████████████████████████] Database       ████████ 0%
STEP 2  [                            ] Auth          ░░░░░░░░ 0%
STEP 3  [                            ] Fields        ░░░░░░░░ 0%
STEP 4  [                            ] Projects      ░░░░░░░░ 0%
STEP 5  [                            ] Papers        ░░░░░░░░ 0%
STEP 6  [                            ] Problems      ░░░░░░░░ 0%
STEP 7  [                            ] Gaps          ░░░░░░░░ 0%
STEP 8  [                            ] Experiments   ░░░░░░░░ 0%
STEP 9  [                            ] Search        ░░░░░░░░ 0%
STEP 10 [                            ] AI+Graph      ░░░░░░░░ 0%

Overall: ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%

Next Milestone: Complete database setup (STEP 1)
Timeline: 8-12 weeks to PRODUCTION
```

---

## 🎯 Success Path

```
START HERE
    │
    ├─→ Read README_MAIN.md (10 min)
    │
    ├─→ Read ARCHITECTURE.md (20 min)
    │
    ├─→ Read DATABASE_SCHEMA.md (30 min)
    │
    ├─→ Follow SETUP_GUIDE.md (20 min)
    │
    ├─→ Execute DEVELOPMENT_ROADMAP.md STEP 1 (3-4 days)
    │
    └─→ Continue STEPS 2-10 (8-12 weeks)
            │
            └─→ PRODUCTION-READY SYSTEM ✅
                 • 22 database tables
                 • 80+ API endpoints
                 • React frontend
                 • AI-powered research platform
                 • Full-text search
                 • Knowledge graph
                 • Extensible domain system
```

---

## 📊 Metrics & Goals

```
CODE QUALITY TARGETS
════════════════════════════════

TypeScript Strict:     ✅ MUST (no 'any')
Test Coverage:         ✅ MUST (>80%)
ESLint Passing:        ✅ MUST (0 errors)
Documentation:         ✅ MUST (100% endpoints)
Security Review:       ✅ MUST (OWASP top 10)
Performance:           ✅ MUST (<500ms response)

DELIVERY TARGETS
════════════════════════════════

Database:              22 tables, fully normalized
API:                   80+ endpoints, fully typed
Frontend:              React components, responsive
Tests:                 Unit + integration tests
Documentation:         Architecture, API, setup guides
Deployment:            Docker-ready, cloud-compatible

TIMELINE TARGET
════════════════════════════════

Week 1-2:              Database & Setup
Week 2-3:              Authentication
Week 3-7:              Core Modules
Week 7-9:              Research Analysis
Week 9-12:             Search & AI

COMPLETION: 8-12 weeks
```

---

## 🚀 Ready to Launch?

You have:
- ✅ Complete architecture
- ✅ Full database schema
- ✅ Complete API specification
- ✅ 10-step implementation plan
- ✅ Setup instructions
- ✅ Project documentation
- ✅ Visual diagrams

**Next Step**: Follow SETUP_GUIDE.md, then start STEP 1 of DEVELOPMENT_ROADMAP.md

**Good luck! 🎉**

