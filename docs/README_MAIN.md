# Himanshu Research Discovery Lab

> **A production-ready, full-stack research operating system for discovering problems, analyzing solutions, identifying research gaps, generating hypotheses, and tracking experiments across ANY research domain.**

**Codename**: Research OS  
**Status**: Under Development (Planning Complete, Ready for STEP 1)  
**Timeline**: 8-12 weeks  
**Architecture**: Full-Stack TypeScript (Backend + Frontend + PostgreSQL)

---

## 🎯 What This Is

A sophisticated research management platform that enables:

✅ **Research Discovery** - Find and organize papers from arXiv, Crossref, Semantic Scholar  
✅ **Problem Tracking** - Maintain a bank of research problems with status progression  
✅ **Solution Analysis** - Compare existing approaches to problems  
✅ **Gap Identification** - Systematically identify research gaps with confidence scoring  
✅ **Hypothesis Generation** - Create testable hypotheses based on gaps  
✅ **Experiment Management** - Design and execute experiments with multi-method comparison  
✅ **Knowledge Organization** - Build knowledge graphs showing entity relationships  
✅ **AI-Powered Assistance** - Claude AI helps explain papers, identify gaps, generate hypotheses  
✅ **Extensible Domain System** - Create custom research fields without code changes  

---

## 🏗️ Architecture Overview

```
Frontend (React + TypeScript)
         ↓
    [API Gateway]
         ↓
Backend (Express + Node.js)
    ├── Auth Service
    ├── Research Fields Service
    ├── Paper Library Service
    ├── Problems/Solutions Service
    ├── Gaps Service
    ├── Experiments Service
    ├── Search Service
    ├── AI Assistant Service
    └── External APIs Service
         ↓
    [PostgreSQL Database]
    - 22 normalized tables
    - Full-text search
    - Knowledge graph
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query |
| **Backend** | Node.js 18, Express, TypeScript, TypeORM |
| **Database** | PostgreSQL 14+, pgvector (ready) |
| **Testing** | Jest, Supertest, React Testing Library |
| **DevOps** | Docker, Docker Compose |
| **AI** | Anthropic Claude API |

---

## 📋 Project Status

### ✅ Completed (Pre-Implementation)
- [x] Architecture document with system design
- [x] Complete database schema (22 tables)
- [x] Full API contract with 80+ endpoints
- [x] 10-step development roadmap
- [x] Local setup guide
- [x] This project summary

### ⏳ In Progress
- [ ] STEP 1: Database setup and migrations
- [ ] STEP 2: Authentication system
- [ ] STEP 3: Research fields module
- [ ] ... (8 more steps)

### 🔮 Planned
- [ ] Vector search (pgvector)
- [ ] Multi-user collaboration
- [ ] Mobile apps
- [ ] Research recommendation engine

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- Docker & Docker Compose
- PostgreSQL 14+ (via Docker)

### 5-Minute Setup

```bash
# Clone repository
git clone <repository>
cd research-os

# Copy environment
cp .env.example .env

# Start database
docker-compose up -d

# Setup backend
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
# Backend now running on http://localhost:3000

# In another terminal, setup frontend
cd frontend
npm install
npm run dev
# Frontend now running on http://localhost:5173
```

**Detailed setup**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 📚 Documentation

| Document | Purpose | Read When |
|----------|---------|-----------|
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | High-level overview | Before starting |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design & decisions | Planning phase |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Database structure details | Before STEP 1 |
| [API_CONTRACTS.md](./API_CONTRACTS.md) | Complete API specification | Before backend coding |
| [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) | 10-step implementation plan | Starting STEP 1 |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Local dev environment | Getting started |

---

## 🎯 10-Step Implementation Plan

```
STEP 1  ✅ Planned  Database & Architecture (3-4 days)
STEP 2  ⏳ Next     Authentication (3-4 days)
STEP 3  ⏳ Queued   Research Fields (2-3 days)
STEP 4  ⏳ Queued   Projects (2 days)
STEP 5  ⏳ Queued   Paper Library (4-5 days)
STEP 6  ⏳ Queued   Problems & Solutions (3-4 days)
STEP 7  ⏳ Queued   Gaps & Hypotheses (3-4 days)
STEP 8  ⏳ Queued   Experiments (4-5 days)
STEP 9  ⏳ Queued   Search & Indexing (2-3 days)
STEP 10 ⏳ Queued   Knowledge Graph & AI (5-7 days)

Total Timeline: 8-12 weeks
```

See [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) for detailed breakdown of each step.

---

## 📊 Database Design

### Core Tables (22 total)

**User & Auth**
- users

**Research Organization**
- research_fields
- research_subfields
- research_projects
- tags
- entity_tags

**Research Input**
- papers
- paper_researchers
- researchers
- datasets
- algorithms

**Research Analysis**
- research_problems
- existing_solutions
- research_gaps
- hypotheses

**Research Execution**
- experiments
- experiment_results
- notes
- citations

**Knowledge Management**
- knowledge_graph_relationships
- research_outputs
- api_audit_log

Full schema: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

## 🔌 API Endpoints

### Major Endpoint Groups (80+ total)

```
Authentication      /api/v1/auth/
Research Fields     /api/v1/fields/
Projects            /api/v1/projects/
Papers              /api/v1/papers/
Problems            /api/v1/problems/
Solutions           /api/v1/solutions/
Research Gaps       /api/v1/gaps/
Hypotheses          /api/v1/hypotheses/
Experiments         /api/v1/experiments/
Datasets            /api/v1/datasets/
Algorithms          /api/v1/algorithms/
Lab Notebook        /api/v1/notes/
Researchers         /api/v1/researchers/
Citations           /api/v1/citations/
Search              /api/v1/search/
AI Assistant        /api/v1/ai/
```

Full API spec: [API_CONTRACTS.md](./API_CONTRACTS.md)

---

## ✨ Key Features

### Research Management
- **Paper Library**: Import from arXiv, Crossref, Semantic Scholar
- **Full-Text Search**: Search papers, problems, notes across database
- **Reading Status Tracking**: UNREAD → READING → READ → ANALYZED → REPRODUCED → CRITIQUED
- **Importance Scoring**: Rate papers on 1-10 scale
- **Researcher Database**: Track authors with ORCID, H-index, citations

### Problem Analysis
- **Problem Bank**: Systematic tracking of research questions
- **Solution Registry**: Known approaches with limitations
- **Status Progression**: DISCOVERED → INVESTIGATING → GAP_FOUND → HYPOTHESIS → EXPERIMENTING → VALIDATED
- **Difficulty Classification**: BEGINNER → INTERMEDIATE → ADVANCED → EXPERT

### Gap Identification
- **Gap Statements**: Specific research gaps with evidence
- **Verification Status**: POTENTIAL → NEEDS_VERIFICATION → LIKELY_EXPLORED → STRONGLY_SUPPORTED
- **Evidence Tracking**: Supporting and contradicting papers
- **Confidence Scoring**: 1-10 scale with novelty and impact estimates

### Experimentation
- **Experiment Design**: Full experiment tracking with methodology
- **Multi-Method Comparison**: Compare baseline A, baseline B, and proposed method
- **Flexible Metrics**: 
  - Classification: accuracy, precision, recall, F1, AUC
  - Performance: latency, throughput, memory, CPU, GPU, energy
  - Custom metrics: Store any metric in JSON
- **Reproducibility Tracking**: Mark results as reproducible/partially/not reproducible

### Knowledge Organization
- **Lab Notebook**: Chronological research notes with timestamps
- **Citation Tracking**: Track which papers cite which
- **Knowledge Graph**: Entity relationships (paper → problem → solution → gap → hypothesis)
- **Tags & Organization**: User-defined tags for flexible organization
- **Soft Deletes**: Never lose research data, only mark as deleted

### AI-Powered Research
- **Paper Explanation**: Understand methodology, limitations, datasets
- **Gap Identification**: AI analyzes papers to find research gaps
- **Paper Comparison**: Compare multiple papers side-by-side
- **Hypothesis Generation**: AI suggests testable hypotheses
- **Experiment Suggestion**: AI recommends experiment designs
- **Methodology Extraction**: AI extracts key methodology details

### Extensibility
- **Custom Research Fields**: Create any research field without code
- **Interdisciplinary Combinations**: Combine fields (AI + IoT + Security)
- **Custom Metadata**: JSON fields allow flexible data storage
- **User-Defined Tagging**: Create and organize with custom tags

---

## 🔐 Security

### Built-In
- JWT-based authentication with HS256
- Bcrypt password hashing (cost 12)
- SQL injection prevention via ORM
- Input validation on all endpoints
- CORS configuration
- Rate limiting (50 req/min per authenticated user)
- User data isolation
- Soft deletes for recovery

### Future
- Multi-factor authentication
- OAuth provider integration
- Fine-grained permissions
- Audit logging

---

## 🧪 Testing

### Current Coverage Target
- Unit tests: >80%
- Integration tests: All critical paths
- Database tests: Migrations, integrity

### Run Tests
```bash
npm run test              # All tests
npm run test:unit         # Unit only
npm run test:integration  # Integration only
npm run test:coverage     # With coverage report
```

---

## 🚀 Development Commands

### Backend
```bash
cd backend

npm run dev              # Start with hot reload
npm run build            # Build for production
npm start                # Run production build

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed initial data
npm run db:reset         # Drop, recreate, seed (careful!)

# Testing
npm run test
npm run test:coverage

# Quality
npm run lint
npm run lint:fix
npm run type-check
```

### Frontend
```bash
cd frontend

npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

npm run test
npm run lint
npm run type-check
```

### Docker
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop
docker-compose down

# Reset (careful!)
docker-compose down -v && docker-compose up -d
```

---

## 📖 Research Domains Included

Seed data starts with real research in:

- **AI/Machine Learning**: Deep learning, LLMs, Computer vision
- **Cybersecurity**: Network security, malware, cryptography
- **IoT Security**: IoT protocols, edge computing, device security
- **Physics**: Frequency analysis, electromagnetic waves, signal processing
- **Algorithms**: Graph algorithms, optimization, approximation
- **Distributed Systems**: Consensus, scalability, fault tolerance
- **Databases**: Query optimization, indexing, replication

**Fully extensible**: Add any field without code changes.

---

## 🎓 Learning Outcomes

Building this teaches:
- Backend API design with Express
- Database design and optimization
- TypeORM and migrations
- React component patterns
- State management with React Query
- Authentication and security
- Testing practices
- DevOps with Docker
- Full-stack development workflow

---

## 🤔 FAQ

**Q: When will this be complete?**
A: Following the roadmap, 8-12 weeks of focused development.

**Q: Can I contribute?**
A: Yes! Start with STEP 1 from DEVELOPMENT_ROADMAP.md

**Q: Can I modify the stack?**
A: Absolutely! These are recommendations. Adapt to your preferences.

**Q: Is this production-ready?**
A: The architecture is. After completing steps 1-10, yes.

**Q: Can I use this for my own research?**
A: Yes! That's the whole point. It's designed for personal research labs.

**Q: What about multi-user collaboration?**
A: v1 is single-user. Multi-user is Phase 2.

**Q: Can I add more research fields?**
A: Yes! Fully extensible without code changes.

---

## 🔄 Project Structure

```
research-os/
├── backend/
│   ├── src/
│   │   ├── entity/           # TypeORM entities
│   │   ├── migration/        # Database migrations
│   │   ├── controller/       # Route handlers
│   │   ├── service/          # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utilities
│   │   ├── types/            # TypeScript types
│   │   ├── config/           # Configuration
│   │   ├── database.ts       # DB connection
│   │   └── app.ts            # Express app
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Pages
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API client
│   │   ├── types/            # Types
│   │   ├── utils/            # Utilities
│   │   ├── styles/           # CSS
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_CONTRACTS.md
│   ├── DEVELOPMENT_ROADMAP.md
│   └── SETUP_GUIDE.md
│
├── docker-compose.yml
├── .gitignore
├── .env.example
└── README.md
```

---

## 📞 Getting Help

1. **Check documentation** - Start with PROJECT_SUMMARY.md
2. **Review architecture** - See ARCHITECTURE.md
3. **Database questions** - See DATABASE_SCHEMA.md
4. **API questions** - See API_CONTRACTS.md
5. **Implementation questions** - See DEVELOPMENT_ROADMAP.md
6. **Setup issues** - See SETUP_GUIDE.md

---

## 📜 License

This project is provided as-is for educational and research purposes.

---

## 🎯 Next Steps

1. **Read** [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for overview
2. **Read** [SETUP_GUIDE.md](./SETUP_GUIDE.md) for local setup
3. **Read** [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) for STEP 1
4. **Execute** STEP 1 (Database setup)

---

## 🙏 Acknowledgments

Built with careful attention to:
- Software engineering best practices
- Production-grade architecture
- Security considerations
- Extensible design patterns
- Comprehensive documentation

---

## 📊 Project Stats

- **Lines of Documentation**: 5000+
- **Database Tables**: 22
- **API Endpoints**: 80+
- **Technology Components**: 15+
- **Development Steps**: 10
- **Estimated Implementation Time**: 8-12 weeks
- **Code Coverage Target**: >80%
- **TypeScript Strict Mode**: ✅ Yes

---

**Status**: Ready to begin development  
**Last Updated**: January 2024  
**Version**: 1.0 (Pre-Implementation)

---

**Let's build something great! 🚀**

Start with [SETUP_GUIDE.md](./SETUP_GUIDE.md) →
