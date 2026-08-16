# Research OS

A comprehensive Research Operating System for systematic research discovery, literature management, gap identification, hypothesis formulation, experiment tracking, and knowledge graph exploration.

## Architecture

```
research-os/
├── frontend/          # React 18 + Vite + Tailwind CSS
├── backend/           # Express.js + TypeScript + TypeORM
├── database/          # PostgreSQL schema & seeds
├── docs/              # Architecture documentation
└── docker-compose.yml # Infrastructure orchestration
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query |
| Backend | Node.js 18+, Express.js, TypeScript, TypeORM |
| Database | PostgreSQL 15 + pgvector, Redis 7 |
| Auth | JWT (HS256) + bcrypt |
| AI | Anthropic Claude / Google Gemini |
| DevOps | Docker, Docker Compose |

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ & npm

### 1. Clone & Configure
```bash
git clone <repo-url>
cd research-os
cp .env.example .env
# Edit .env with your settings
```

### 2. Start Infrastructure
```bash
docker-compose up -d
```
This starts PostgreSQL (port 5432), pgAdmin (port 5050), and Redis (port 6379).

### 3. Start Backend
```bash
cd backend
npm install
npm run migration:run
npm run seed
npm run dev
```
API available at http://localhost:3000/api/v1

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
UI available at http://localhost:5173

## Core Modules

- **📚 Paper Library** — Import, track, and analyze academic papers
- **🔬 Problem Bank** — Identify and track research problems
- **🎯 Gap Engine** — Discover research gaps with evidence scoring
- **💡 Hypothesis Lab** — Formulate and track testable hypotheses
- **🧪 Experiment Lab** — Design experiments with multi-metric benchmarking
- **📊 Dataset Registry** — Track benchmark datasets with versioning
- **🧮 Algorithm Library** — Catalog algorithms with complexity analysis
- **📓 Lab Notebook** — Chronological research journal
- **🕸️ Knowledge Graph** — Visual research relationship explorer
- **🤖 AI Assistant** — Claude/Gemini-powered research analysis

## Research Taxonomy (9 Fields)

1. Computer Science
2. Cybersecurity
3. IoT & Embedded Systems
4. Signal & Information Processing
5. Waves / Frequency / Electromagnetics
6. Physics + Computing
7. Mathematics for Research
8. Robotics & Autonomous Systems
9. Emerging / Interdisciplinary

## Database (22 Tables)

Users, Research Fields, Subfields, Projects, Papers, Researchers, Datasets, Algorithms, Problems, Solutions, Gaps, Hypotheses, Experiments, Results, Notes, Citations, Tags, Entity Tags, Knowledge Graph, Research Outputs, Audit Log.

## API Endpoints (80+)

All endpoints under `/api/v1/`:
- `/auth` — Registration, login, profile
- `/fields` — Research taxonomy management
- `/projects` — Research workspace management
- `/papers` — Paper library with import
- `/problems` — Problem bank
- `/solutions` — Existing solution tracking
- `/gaps` — Research gap discovery
- `/hypotheses` — Hypothesis formulation
- `/experiments` — Experiment management
- `/datasets` — Dataset registry
- `/algorithms` — Algorithm catalog
- `/notes` — Lab notebook
- `/researchers` — Researcher profiles
- `/citations` — Citation graph
- `/search` — Global full-text search
- `/ai` — AI research assistant

## License

Private — All rights reserved.
