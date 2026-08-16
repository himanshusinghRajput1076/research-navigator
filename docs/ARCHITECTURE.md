# Himanshu Research Discovery Lab - Architecture Document

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + TypeScript)               │
│  (Dashboard, Papers, Projects, Experiments, Knowledge Graph)    │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS + JWT
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API GATEWAY & MIDDLEWARE                       │
│  (Authentication, Rate Limiting, Logging, Error Handling)       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND API (Node.js/Express)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Modules:                                                 │   │
│  │ • Authentication Service                                 │   │
│  │ • Research Fields Service                                │   │
│  │ • Projects Service                                       │   │
│  │ • Papers Service                                         │   │
│  │ • Researchers Service                                    │   │
│  │ • Problems/Solutions Service                             │   │
│  │ • Gaps Service                                           │   │
│  │ • Experiments Service                                    │   │
│  │ • Search Service                                         │   │
│  │ • AI Assistant Service                                   │   │
│  │ • External APIs Service                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
     PostgreSQL     Redis Cache    File Storage
   (Persistent)    (Sessions)      (PDFs, etc.)
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM (for type safety + migrations)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod or Joi
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Documentation**: OpenAPI/Swagger

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **State**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui or Radix UI
- **Forms**: React Hook Form
- **Charts**: Recharts (for knowledge graph visualization)
- **Testing**: Vitest + React Testing Library

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Package Manager**: npm or pnpm
- **Version Control**: Git

### External Services (Future)
- OpenAlex API
- Crossref API
- arXiv API
- Semantic Scholar API
- ORCID API
- Anthropic Claude API (for AI assistant)

---

## 📊 Database Design Principles

1. **Normalization**: 3NF for data integrity
2. **Extensibility**: JSON fields for flexible research metadata
3. **Relationships**: Full referential integrity with foreign keys
4. **Audit Trail**: created_at, updated_at, created_by timestamps
5. **Soft Deletes**: is_deleted flag for data recovery
6. **Indexing**: Strategic indexes on search fields
7. **UUID Primary Keys**: For distributed systems readiness

---

## 🔐 Security Architecture

### Authentication Flow
```
User Login → Password Hash (bcrypt) → JWT Token (HS256)
                                      ↓
                            API Request + JWT
                                      ↓
                    Middleware Verification
                                      ↓
                    Request Handler (with user context)
```

### Authorization
- Role-based access control (User, Admin)
- User-scoped data (private research lab initially)
- Session-based tracking

### Data Protection
- JWT for stateless sessions
- Bcrypt for password hashing (cost: 12)
- CORS for cross-origin protection
- Rate limiting (50 requests/min per user)
- Input validation on all endpoints
- SQL injection prevention via ORM

---

## 📡 API Design Philosophy

### REST Conventions
```
GET    /api/v1/papers              → List papers
POST   /api/v1/papers              → Create paper
GET    /api/v1/papers/:id          → Get paper
PATCH  /api/v1/papers/:id          → Update paper
DELETE /api/v1/papers/:id          → Delete paper (soft)

GET    /api/v1/papers/:id/analyses → Related analyses
GET    /api/v1/search?q=term       → Full-text search
```

### Error Responses (Standard)
```json
{
  "status": "error",
  "code": "INVALID_REQUEST",
  "message": "Description of what went wrong",
  "details": { "field": "error details" }
}
```

### Pagination
```
GET /api/v1/papers?page=1&limit=20&sort=-created_at
```

### Versioning
- `/api/v1/` for current version
- Support multiple versions for backward compatibility

---

## 🗂️ Project Structure

```
research-os/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── entity/               # TypeORM entities
│   │   ├── migration/            # Database migrations
│   │   ├── controller/           # Route handlers
│   │   ├── service/              # Business logic
│   │   ├── middleware/           # Express middleware
│   │   ├── utils/                # Helpers
│   │   ├── types/                # TypeScript types
│   │   ├── config/               # Configuration
│   │   ├── database.ts           # DB connection
│   │   └── app.ts                # Express app
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
│
├── database/
│   ├── migrations/
│   ├── seed/
│   └── schema.sql
│
├── docs/
│   ├── API.md                    # OpenAPI spec
│   ├── DATABASE.md               # Schema docs
│   ├── SETUP.md                  # Setup guide
│   └── DEVELOPMENT.md            # Dev guide
│
├── docker-compose.yml
├── .gitignore
├── .env.example
└── README.md
```

---

## 📋 Development Workflow

### Step-by-Step Approach
1. **Architecture & Database** (Database schema, migrations, TypeORM setup)
2. **Authentication** (JWT, login, user management)
3. **Research Fields** (Dynamic field/subfield creation)
4. **Projects Module** (Create, read, update projects)
5. **Paper Library** (CRUD, metadata management)
6. **Problems & Solutions** (Problem bank, solution tracking)
7. **Gaps System** (Gap identification and verification)
8. **Experiments Module** (Run, compare, track experiments)
9. **Search & Indexing** (Full-text search across entities)
10. **AI Research Assistant** (Claude integration)

### Per-Step Checklist
- [ ] Database migrations (if needed)
- [ ] TypeORM entities updated
- [ ] API endpoints defined and documented
- [ ] Business logic in services
- [ ] Input validation added
- [ ] Error handling implemented
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests for API
- [ ] Frontend components built
- [ ] UI/UX tested
- [ ] API documentation updated
- [ ] README updated
- [ ] Seed data added (if applicable)

---

## 🔄 Data Flow Example: Creating a Research Paper

```
USER INPUT
  ↓
Frontend Form Component
  ↓
Validation (React Hook Form + Zod)
  ↓
POST /api/v1/papers
  ↓
Backend Controller
  ↓
Middleware (Auth, Validation)
  ↓
Service Layer (Business Logic)
  ↓
TypeORM Repository
  ↓
PostgreSQL Database
  ↓
Response to Frontend
  ↓
Frontend State Update (React Query)
  ↓
UI Re-render
```

---

## 🧪 Testing Strategy

### Unit Tests
- Utility functions
- Service logic
- Validators
- **Target**: 80%+ coverage

### Integration Tests
- API endpoints with real database
- Auth flow
- Middleware behavior
- **Target**: All critical paths

### E2E Tests (Later)
- User workflows
- Complete research flow

---

## 🚀 Deployment Considerations

### Development
- `docker-compose up` for local dev
- Hot reload for backend and frontend
- Seed database with test data

### Production
- Multi-stage Docker build
- Environment-based configuration
- Database backups
- API rate limiting
- HTTPS enforcement
- CORS properly configured

---

## 🔮 Future Extensibility

### Vector Search
- Use pgvector extension
- Store embeddings for papers/problems
- Semantic search across research

### External APIs
- Queue system for async API calls
- Caching layer for external data
- Error handling for API failures

### AI Integration
- LLM API wrapper service
- Prompt templates for different tasks
- Response caching

### Knowledge Graph
- GraphQL API (alongside REST)
- Relationship visualization
- Path finding algorithms

### Scalability
- Horizontal scaling (stateless API)
- Database read replicas
- Caching layer (Redis)
- CDN for static assets

---

## ✅ Quality Gates

Before marking a step complete:
1. All tests pass
2. TypeScript strict mode (no any)
3. No console.log in production code
4. Error handling on all async operations
5. API documented
6. Database migrations reversible
7. README up to date
8. No secrets in code
9. Code review (self-review with checklist)

---

## 📞 Questions to Resolve

- [ ] Cloud deployment target? (AWS, DigitalOcean, etc.)
- [ ] SMTP for email notifications?
- [ ] PDF extraction requirements?
- [ ] Multi-user collaboration vs. personal research?
- [ ] Research output generation (auto-format to PDF/Word)?
- [ ] Integration with GitHub for prototype hosting?

---

**Next**: Create database schema based on this architecture.
