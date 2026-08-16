# Development Roadmap - Himanshu Research Discovery Lab

## 🎯 Overview

Building a production-ready full-stack research platform in 10 carefully planned steps. Each step is designed to be completed independently with full testing before moving forward.

**Estimated Timeline**: 8-12 weeks for one developer
**Code Repository**: Single monorepo with frontend, backend, database subdirectories

---

## 📋 STEP 1: Project Setup & Database Architecture

**Timeline**: 3-4 days

### Objectives
- Initialize project structure
- Set up PostgreSQL locally with Docker
- Configure TypeORM and database migrations
- Create all database tables
- Add seeds for initial data

### Deliverables

**1.1 Project Structure**
```
research-os/
├── backend/
│   ├── src/
│   │   ├── entity/           (Empty for now)
│   │   ├── migration/        
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── database.ts
│   │   └── app.ts
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/ (Empty for now)
├── database/
│   ├── migrations/
│   └── seeds/
├── docs/
│   ├── ARCHITECTURE.md       ✅ (done)
│   ├── DATABASE_SCHEMA.md    ✅ (done)
│   ├── API_CONTRACTS.md      ✅ (done)
│   └── SETUP.md
├── docker-compose.yml
├── README.md
└── .gitignore
```

**1.2 Configuration Files**

`.env.example`
```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=research_os
DB_USER=research_user
DB_PASSWORD=secure_password_change_me
DB_SSL=false

# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# JWT
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRY=24h

# CORS
CORS_ORIGIN=http://localhost:5173

# External APIs (leave empty for now)
ARXIV_API_URL=https://api.arxiv.org/v1
CROSSREF_API_URL=https://api.crossref.org
SEMANTIC_SCHOLAR_API_URL=https://api.semanticscholar.org

# Logging
LOG_LEVEL=debug
```

**1.3 Docker Setup**

`docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: research_user
      POSTGRES_PASSWORD: secure_password_change_me
      POSTGRES_DB: research_os
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U research_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

**1.4 TypeORM Configuration**

`backend/src/database.ts`
```typescript
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Use migrations, not auto-sync
  logging: process.env.NODE_ENV === "development",
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw error;
  }
}
```

**1.5 Database Migrations**

Create initial migration file: `src/migration/1_InitialSchema.ts`
- Converts DATABASE_SCHEMA.md into actual SQL
- Creates all 22 tables
- Adds indexes
- Adds triggers for tsvector
- Creates extensions (uuid-ossp, pg_trgm for text search)

**1.6 Seed Data**

Create `database/seeds/01_research_fields.ts`:
- Insert seed research fields (AI, Cybersecurity, IoT, Physics, etc.)
- Insert subfields for each
- Add ~5 seed researchers
- Add 10-15 real papers from real research (N-BaIoT, IoTID20, etc.)

### Checklist
- [ ] Repository initialized with git
- [ ] Docker Compose file tested
- [ ] PostgreSQL starts and is healthy
- [ ] TypeORM configured
- [ ] Database migration created and applied successfully
- [ ] All 22 tables created
- [ ] Indexes created
- [ ] Seed data inserted
- [ ] Data verified with pgAdmin
- [ ] README updated with setup instructions
- [ ] .env.example committed
- [ ] No secrets in code

---

## 📋 STEP 2: Backend Setup & Authentication

**Timeline**: 3-4 days

### Objectives
- Set up Express.js server with middleware
- Implement JWT authentication
- Create user registration and login endpoints
- Add input validation
- Add error handling middleware
- Write unit tests

### Deliverables

**2.1 TypeORM Entities**

`src/entity/User.ts`:
```typescript
@Entity('users')
@Index('idx_users_email')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  full_name: string;

  // ... other fields
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

**2.2 Express App Setup**

`src/app.ts`:
- Express initialization
- Middleware stack: CORS, JSON parsing, logging, rate limiting
- Error handling middleware
- 404 handler

**2.3 Authentication Service**

`src/service/auth.service.ts`:
```typescript
class AuthService {
  async register(email, password, full_name): Promise<User>
  async login(email, password): Promise<{user: User, token: string}>
  async validateToken(token): Promise<User>
  async getProfile(userId): Promise<User>
  async updateProfile(userId, updates): Promise<User>
}
```

**2.4 Authentication Controller**

`src/controller/auth.controller.ts`:
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
PATCH  /api/v1/auth/me
```

**2.5 Middleware**

`src/middleware/auth.middleware.ts`:
- JWT extraction from Authorization header
- Token validation
- Attach user to request
- Handle missing/expired tokens

`src/middleware/validation.middleware.ts`:
- Input validation using Zod schemas
- Error response formatting

**2.6 Utilities**

`src/utils/password.ts`:
- Hash password with bcrypt (cost: 12)
- Compare password

`src/utils/jwt.ts`:
- Sign JWT token
- Verify JWT token
- Extract claims

**2.7 Types**

`src/types/index.ts`:
```typescript
interface IAuthRequest extends Request {
  user?: User;
}

interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
```

**2.8 Tests**

`tests/integration/auth.test.ts`:
```typescript
describe('Authentication', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user')
    it('should hash password')
    it('should reject duplicate email')
    it('should validate email format')
    it('should require password complexity')
  })

  describe('POST /api/v1/auth/login', () => {
    it('should login with correct credentials')
    it('should reject invalid credentials')
    it('should return JWT token')
  })

  describe('GET /api/v1/auth/me', () => {
    it('should return authenticated user')
    it('should reject without token')
    it('should reject with invalid token')
  })
})
```

**2.9 Documentation**

Update `docs/SETUP.md`:
- Local development setup
- Running tests
- Database commands
- Environment configuration

### Checklist
- [ ] Express app starts successfully
- [ ] CORS configured
- [ ] User entity created
- [ ] Authentication service implemented
- [ ] Password hashing works
- [ ] JWT tokens generated and validated
- [ ] Register endpoint works
- [ ] Login endpoint works
- [ ] Profile retrieval works
- [ ] Invalid credentials rejected
- [ ] Expired tokens rejected
- [ ] Validation middleware working
- [ ] Error responses formatted correctly
- [ ] All auth tests passing (100% coverage)
- [ ] No console.log in production code
- [ ] Rate limiting on auth endpoints

---

## 📋 STEP 3: Research Fields Module

**Timeline**: 2-3 days

### Objectives
- Implement extensible field/subfield system
- Create CRUD endpoints
- Add validation
- Enable users to create custom fields
- Write tests

### Deliverables

**3.1 Entities**

`src/entity/ResearchField.ts`
`src/entity/ResearchSubfield.ts`

**3.2 Services**

`src/service/field.service.ts`:
```typescript
class FieldService {
  async getAllFields(page, limit)
  async getFieldById(id)
  async createField(data, userId)
  async updateField(id, data, userId)
  async deleteField(id, userId)
  
  async getSubfields(fieldId)
  async createSubfield(fieldId, data, userId)
}
```

**3.3 Controllers**

```
GET    /api/v1/fields
POST   /api/v1/fields
GET    /api/v1/fields/:id
PATCH  /api/v1/fields/:id
DELETE /api/v1/fields/:id

GET    /api/v1/fields/:id/subfields
POST   /api/v1/fields/:id/subfields
PATCH  /api/v1/fields/:id/subfields/:subId
```

**3.4 Validation**

Create Zod schemas:
- Field creation (name, description, color, icon)
- Subfield creation
- Update validation

**3.5 Tests**

`tests/integration/fields.test.ts`:
```typescript
describe('Research Fields', () => {
  it('should list all fields')
  it('should get field with subfields')
  it('should create custom field')
  it('should prevent duplicate field names')
  it('should create subfield under field')
  it('should enforce field exists before subfield creation')
})
```

**3.6 Seed Data**

Ensure seeds include:
- AI/ML field with subfields (Deep Learning, NLP, Computer Vision, etc.)
- Cybersecurity field (Cryptography, Network Security, etc.)
- IoT field (Protocols, Security, etc.)
- Physics field (Waves, Frequency, Magnetism, etc.)

### Checklist
- [ ] Field entity created
- [ ] Subfield entity created
- [ ] Services implemented
- [ ] All endpoints working
- [ ] Field slug generation working
- [ ] Validation working
- [ ] Duplicate prevention working
- [ ] User isolation verified
- [ ] Tests passing
- [ ] API documented in swagger
- [ ] Seed data verified

---

## 📋 STEP 4: Projects Module

**Timeline**: 2 days

### Objectives
- Create user projects for organizing research
- Link to fields/subfields
- Status tracking
- Basic CRUD

### Deliverables

**4.1 Entity**

`src/entity/ResearchProject.ts`:
- User association
- Field association
- Status: ACTIVE, PAUSED, COMPLETED, ARCHIVED
- Dates and description

**4.2 Service & Controller**

```
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
```

**4.3 Tests**

Verify user isolation, status changes, field linking.

### Checklist
- [ ] Project CRUD working
- [ ] User isolation verified
- [ ] Status transitions working
- [ ] Field linking working
- [ ] Tests passing

---

## 📋 STEP 5: Paper Library Module

**Timeline**: 4-5 days

### Objectives
- Complete paper CRUD
- Paper search functionality
- Reading status tracking
- Importance scoring
- Manual and API import
- PDF metadata tracking

### Deliverables

**5.1 Entity**

`src/entity/Paper.ts`:
- All 20+ fields from schema
- Full-text search vector
- Metadata JSON fields

**5.2 Service**

`src/service/paper.service.ts`:
- CRUD operations
- Search by title/authors/keywords
- Full-text search
- Filter by reading status, importance, field
- Add from arXiv/Crossref APIs (wrapper calls)

**5.3 Controller**

```
GET    /api/v1/papers                    (list with filters)
POST   /api/v1/papers                    (add manually)
GET    /api/v1/papers/:id                (get with related entities)
PATCH  /api/v1/papers/:id                (update metadata, reading status)
DELETE /api/v1/papers/:id                (soft delete)

POST   /api/v1/papers/import/arxiv       (import by arXiv ID)
POST   /api/v1/papers/import/crossref    (import by DOI)
GET    /api/v1/papers/:id/citations      (related papers)
```

**5.4 External API Wrappers**

`src/service/external/arxiv.service.ts`:
- Query arXiv by ID/query
- Parse results
- Format for database

`src/service/external/crossref.service.ts`:
- Query by DOI
- Parse results

**5.5 Full-Text Search**

- Implement PostgreSQL tsvector search
- Create search endpoint

**5.6 Tests**

```typescript
describe('Papers', () => {
  it('should add paper manually')
  it('should import from arXiv')
  it('should import from Crossref')
  it('should prevent duplicate DOI')
  it('should search by title')
  it('should search by authors')
  it('should filter by reading status')
  it('should update reading status')
  it('should track importance score')
})
```

### Checklist
- [ ] Paper CRUD working
- [ ] All fields populated
- [ ] Manual add working
- [ ] ArXiv import working (with real paper)
- [ ] Crossref import working (with real paper)
- [ ] Full-text search working
- [ ] Status tracking working
- [ ] Filtering working
- [ ] Pagination working
- [ ] Tests passing

---

## 📋 STEP 6: Problems & Solutions Module

**Timeline**: 3-4 days

### Objectives
- Research problem tracking
- Solution bank
- Status progression
- Link papers to problems
- Gap management

### Deliverables

**6.1 Entities**

`src/entity/ResearchProblem.ts`
`src/entity/ExistingSolution.ts`

**6.2 Service & Controller**

```
GET    /api/v1/problems
POST   /api/v1/problems
GET    /api/v1/problems/:id
PATCH  /api/v1/problems/:id
DELETE /api/v1/problems/:id

GET    /api/v1/problems/:id/solutions
POST   /api/v1/problems/:id/solutions
PATCH  /api/v1/problems/:problemId/solutions/:solutionId
```

**6.3 Queries**

- Find problems by status
- Find problems by difficulty
- Find problems in project
- Find solutions for problem
- Rank problems by impact

**6.4 Tests**

```typescript
describe('Research Problems', () => {
  it('should create problem')
  it('should track status changes')
  it('should add solutions')
  it('should prevent invalid status transitions')
  it('should calculate impact score')
})
```

### Checklist
- [ ] Problem CRUD working
- [ ] Solution tracking working
- [ ] Status progression working
- [ ] Paper linking working
- [ ] Tests passing

---

## 📋 STEP 7: Gaps & Hypotheses Module

**Timeline**: 3-4 days

### Objectives
- Research gap identification
- Gap verification status
- Hypothesis generation
- Link to experiments
- Confidence scoring

### Deliverables

**7.1 Entities**

`src/entity/ResearchGap.ts`
`src/entity/Hypothesis.ts`

**7.2 Service**

```typescript
class GapService {
  async createGap(data, userId)
  async updateGapStatus(gapId, status, evidence)
  async addSupportingPaper(gapId, paperId)
  async generateHypothesis(gapId, data)
}
```

**7.3 Controller**

```
GET    /api/v1/gaps
POST   /api/v1/gaps
GET    /api/v1/gaps/:id
PATCH  /api/v1/gaps/:id

GET    /api/v1/hypotheses
POST   /api/v1/hypotheses
PATCH  /api/v1/hypotheses/:id
```

**7.4 Validation**

- Gap statements must be falsifiable
- Status progression: POTENTIAL → NEEDS_VERIFICATION → LIKELY_EXPLORED / STRONGLY_SUPPORTED
- Confidence scoring (1-10)

**7.5 Tests**

### Checklist
- [ ] Gap creation working
- [ ] Status tracking working
- [ ] Evidence linking working
- [ ] Hypothesis creation working
- [ ] Tests passing

---

## 📋 STEP 8: Experiments & Results Module

**Timeline**: 4-5 days

### Objectives
- Experiment design tracking
- Result recording
- Baseline comparison
- Metric tracking
- Reproducibility status

### Deliverables

**8.1 Entities**

`src/entity/Experiment.ts`
`src/entity/ExperimentResult.ts`
`src/entity/Dataset.ts`

**8.2 Service**

```typescript
class ExperimentService {
  async createExperiment(data, userId)
  async addResults(experimentId, results)
  async compareResults(experimentId)
  async getComparison(experimentIds)
}
```

**8.3 Controller**

```
GET    /api/v1/experiments
POST   /api/v1/experiments
GET    /api/v1/experiments/:id
PATCH  /api/v1/experiments/:id
POST   /api/v1/experiments/:id/results
GET    /api/v1/experiments/:id/comparison
POST   /api/v1/datasets
GET    /api/v1/datasets
```

**8.4 Metrics Support**

- Accuracy, Precision, Recall, F1, AUC
- Latency, Throughput, Memory, CPU, GPU, Energy
- Custom metrics (JSON)

**8.5 Comparison Queries**

- Compare baseline A vs B vs proposed
- Generate comparison table
- Statistical significance testing (optional)

**8.6 Tests**

### Checklist
- [ ] Experiment CRUD working
- [ ] Results recording working
- [ ] All metrics supported
- [ ] Comparison working
- [ ] Dataset registry working
- [ ] Tests passing

---

## 📋 STEP 9: Search & Indexing

**Timeline**: 2-3 days

### Objectives
- Global full-text search
- Search across all entity types
- Highlighting
- Filtering
- Prepare for vector search (pgvector)

### Deliverables

**9.1 Search Service**

`src/service/search.service.ts`:
```typescript
class SearchService {
  async searchPapers(query, filters)
  async searchProblems(query, filters)
  async searchGaps(query, filters)
  async globalSearch(query, entityTypes)
}
```

**9.2 Controller**

```
GET    /api/v1/search?q=query&entity_types=papers,problems,gaps
GET    /api/v1/search/papers?q=query&field_id=uuid
GET    /api/v1/search/problems?q=query
```

**9.3 Full-Text Search Implementation**

- Use PostgreSQL tsvector/tsquery
- Implement in queries for papers, problems, notes
- Add highlighting support

**9.4 Prepare pgvector**

- Comment out pgvector setup for now
- Plan structure for embeddings table
- Document how to enable later

**9.5 Tests**

- Search functionality tests
- Filter tests
- Performance tests

### Checklist
- [ ] Global search working
- [ ] Entity-specific search working
- [ ] Highlighting working
- [ ] Filtering working
- [ ] Pagination working
- [ ] Performance acceptable
- [ ] Tests passing

---

## 📋 STEP 10: Knowledge Graph & AI Assistant

**Timeline**: 5-7 days

### Objectives
- Entity relationship tracking
- Knowledge graph visualization prep
- AI assistant integration (Claude API)
- Paper explanation, gap identification, comparison
- Hypothesis generation

### Deliverables

**10.1 Knowledge Graph**

`src/entity/KnowledgeGraphRelationship.ts`:
- Track relationships between entities
- Relationship types: cites, addresses, extends, contradicts, relates_to
- Strength scoring

**10.2 Knowledge Graph Service**

```typescript
class KnowledgeGraphService {
  async createRelationship(source, target, type)
  async getRelatedEntities(entityId, entityType)
  async findPaths(fromId, toId)
  async getSubgraph(entityIds)
}
```

**10.3 AI Assistant Service**

`src/service/ai/assistant.service.ts`:
```typescript
class ResearchAssistant {
  async explainPaper(paperId, aspect)
  async comparePapers(paperIds, aspects)
  async identifyGaps(problemId, paperIds)
  async generateHypotheses(problemId)
  async extractMethodology(paperId)
  async suggestExperiments(gapId)
}
```

**10.4 Claude API Integration**

`src/service/ai/claude.service.ts`:
- Wrapper for Anthropic Claude API
- Prompt templates for different tasks
- Error handling
- Rate limiting
- Cost tracking

**10.5 AI Prompts**

Define prompts for:
- Paper explanation (for different levels)
- Gap identification
- Paper comparison
- Methodology extraction
- Limitation analysis
- Experiment suggestion
- Hypothesis generation

**10.6 Validation**

- AI responses include source citations
- Distinguish facts from inferences
- Mark unverified claims as hypotheses
- Never present AI outputs as novel research

**10.7 Controller**

```
POST   /api/v1/ai/explain-paper
POST   /api/v1/ai/compare-papers
POST   /api/v1/ai/identify-gaps
POST   /api/v1/ai/generate-hypotheses
POST   /api/v1/ai/suggest-experiments
POST   /api/v1/ai/extract-methodology
```

**10.8 Tests**

- AI request/response tests
- Claude API error handling
- Rate limiting tests
- Response quality validation

### Checklist
- [ ] Knowledge graph relationships created
- [ ] Graph queries working
- [ ] Claude API integration working
- [ ] Explain paper working
- [ ] Compare papers working
- [ ] Gap identification working
- [ ] Hypothesis generation working
- [ ] All AI responses cite sources
- [ ] Tests passing
- [ ] API costs monitored

---

## 🎯 Frontend Development (Parallel to Backend Steps 6+)

While backend steps 1-5 are being completed, frontend setup can start:

**Frontend Phase 1** (alongside Step 5):
- React setup with Vite
- TypeScript configuration
- TanStack Query setup
- Tailwind CSS
- Authentication pages (login, register)
- Protected routes

**Frontend Phase 2** (alongside Step 6):
- Dashboard layout
- Projects list/detail
- Papers library UI
- Search interface

**Frontend Phase 3** (alongside Step 7+):
- Problems module UI
- Experiments module UI
- Knowledge graph visualization
- AI assistant chat interface

---

## 📊 Quality Metrics

For each step, measure:

```
Code Coverage:          >80%
TypeScript Strict:      ✅ No 'any'
Linting:                ESLint zero errors
API Documentation:      100% of endpoints documented
Database Tests:         All migrations reversible
Performance:            Response time <500ms
Security:               OWASP top 10 checked
```

---

## 🚀 Testing Strategy

### Unit Tests (per service)
```bash
npm test:unit
```

### Integration Tests (API + DB)
```bash
npm test:integration
```

### All Tests
```bash
npm test
```

---

## 📝 Documentation Updates

After each step:
- [ ] README updated
- [ ] API.md updated
- [ ] CHANGELOG.md updated
- [ ] New environment variables documented
- [ ] Database schema changes documented

---

## 🔄 Code Review Checklist

Before marking a step complete:

```
[ ] All tests passing
[ ] Code coverage >80%
[ ] No TypeScript errors
[ ] ESLint passes
[ ] No console.log in production code
[ ] No hardcoded values (use .env)
[ ] Error handling complete
[ ] API documented
[ ] Database migrations work and reverse
[ ] No secrets in code
[ ] README updated
[ ] Peer review (self-review with checklist)
```

---

## 🎯 Success Criteria

A step is **COMPLETE** when:

1. ✅ All code written and committed
2. ✅ All tests passing (>80% coverage)
3. ✅ API endpoints fully functional
4. ✅ Database operations verified
5. ✅ Documentation updated
6. ✅ No unresolved TODOs in code
7. ✅ Secrets not in version control
8. ✅ Ready for code review

---

## ⚠️ Gotchas to Avoid

1. **Don't skip tests** - Test as you go, not after
2. **Don't use mock data where persistence is needed** - Use real DB
3. **Don't hardcode values** - Always use env vars
4. **Don't skip documentation** - Docs are code
5. **Don't create entities without migrations** - Use TypeORM migrations
6. **Don't expose API keys in frontend** - Backend only
7. **Don't query database without indexes** - Add indexes proactively
8. **Don't modify old migrations** - Create new ones for changes

---

## 📞 Getting Unstuck

If you hit a blocker:

1. Check the relevant documentation file (ARCHITECTURE.md, DATABASE_SCHEMA.md, API_CONTRACTS.md)
2. Review similar implementations in database schema
3. Check TypeORM documentation for entity patterns
4. Write a failing test first, then implement

---

**Ready to start? Begin with STEP 1 in the next section.**

