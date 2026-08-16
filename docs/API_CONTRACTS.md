# API Contracts - Himanshu Research Discovery Lab

## 📡 API Overview

- **Base URL**: `/api/v1`
- **Authentication**: JWT Bearer Token in Authorization header
- **Content-Type**: `application/json`
- **Response Format**: All responses wrapped in standard envelope

---

## 🎯 Response Envelopes

### Success Response
```json
{
  "status": "success",
  "code": "OK",
  "data": {},
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "field_name": "Error description"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

## 🔐 Authentication Endpoints

### POST /api/v1/auth/register
Register a new user.

**Request**
```json
{
  "email": "himanshu@example.com",
  "password": "SecurePassword123!",
  "full_name": "Himanshu Singh",
  "institution": "Origenix Digital Solutions",
  "country": "India"
}
```

**Response** (201 Created)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "email": "himanshu@example.com",
    "full_name": "Himanshu Singh",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Codes**
- `USER_EXISTS`: Email already registered
- `VALIDATION_ERROR`: Invalid email or password format
- `WEAK_PASSWORD`: Password doesn't meet requirements

---

### POST /api/v1/auth/login
User login.

**Request**
```json
{
  "email": "himanshu@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "email": "himanshu@example.com",
    "full_name": "Himanshu Singh",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Codes**
- `INVALID_CREDENTIALS`: Wrong email or password
- `USER_NOT_FOUND`: User doesn't exist
- `ACCOUNT_LOCKED`: Too many failed attempts

---

### GET /api/v1/auth/me
Get current authenticated user profile.

**Headers**
```
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "email": "himanshu@example.com",
    "full_name": "Himanshu Singh",
    "institution": "Origenix",
    "country": "India",
    "bio": "...",
    "research_interests": ["AI", "IoT"],
    "orcid_id": "0000-0001-2345-6789",
    "github_username": "himanshu",
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-15T10:30:00Z"
  }
}
```

---

### PATCH /api/v1/auth/me
Update current user profile.

**Request**
```json
{
  "full_name": "Himanshu Singh",
  "bio": "CEO at Origenix, passionate about AI & IoT",
  "research_interests": ["AI", "IoT", "Cybersecurity"],
  "orcid_id": "0000-0001-2345-6789"
}
```

**Response** (200 OK) - Updated user object

---

### POST /api/v1/auth/logout
Logout (invalidate token).

**Response** (200 OK)
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

## 🔬 Research Fields Endpoints

### GET /api/v1/fields
List all research fields with pagination.

**Query Parameters**
```
?page=1&limit=20&search=ai
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Artificial Intelligence",
      "slug": "artificial-intelligence",
      "description": "...",
      "color": "#FF6B6B",
      "icon": "brain",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 15 }
}
```

---

### POST /api/v1/fields
Create a new research field.

**Request**
```json
{
  "name": "Quantum Machine Learning",
  "description": "Intersection of quantum computing and ML",
  "color": "#00D9FF",
  "icon": "quantum"
}
```

**Response** (201 Created)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Quantum Machine Learning",
    "slug": "quantum-machine-learning",
    ...
  }
}
```

---

### GET /api/v1/fields/:id
Get single field with subfields.

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Artificial Intelligence",
    "slug": "artificial-intelligence",
    "description": "...",
    "subfields": [
      {
        "id": "uuid",
        "name": "Machine Learning",
        "slug": "machine-learning"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### GET /api/v1/fields/:id/subfields
List subfields for a field.

**Response** (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Deep Learning",
      "slug": "deep-learning",
      "description": "...",
      "field_id": "uuid"
    }
  ]
}
```

---

### POST /api/v1/fields/:id/subfields
Create a subfield under a field.

**Request**
```json
{
  "name": "Transformers",
  "description": "Transformer architectures and attention mechanisms"
}
```

**Response** (201 Created)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Transformers",
    "slug": "transformers",
    "field_id": "uuid"
  }
}
```

---

## 📚 Papers Endpoints

### GET /api/v1/papers
List papers with filtering.

**Query Parameters**
```
?page=1&limit=20&project_id=uuid&field_id=uuid&reading_status=UNREAD&sort=-importance_score
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Attention Is All You Need",
      "authors": [{"name": "Vaswani", "email": "..."}],
      "publication_year": 2017,
      "venue": "NeurIPS",
      "doi": "10.5555/...",
      "arxiv_id": "1706.03762",
      "abstract": "...",
      "keywords": ["transformers", "attention"],
      "reading_status": "UNREAD",
      "importance_score": 9,
      "field_id": "uuid",
      "subfield_id": "uuid",
      "url": "...",
      "pdf_url": "...",
      "personal_notes": "Must read for understanding modern NLP",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 250 }
}
```

---

### POST /api/v1/papers
Add a new paper manually.

**Request**
```json
{
  "title": "Deep Residual Learning for Image Recognition",
  "authors": [
    {"name": "He, Kaiming", "email": "..."},
    {"name": "Zhang, Xiangyu", "email": "..."}
  ],
  "publication_year": 2015,
  "venue": "CVPR",
  "doi": "10.1109/CVPR.2016.90",
  "arxiv_id": "1512.03385",
  "abstract": "...",
  "keywords": ["deep learning", "cnn"],
  "url": "https://...",
  "field_id": "uuid",
  "subfield_id": "uuid",
  "project_id": "uuid",
  "importance_score": 8,
  "personal_notes": "ResNet architecture"
}
```

**Response** (201 Created)
```json
{
  "status": "success",
  "data": { /* Full paper object */ }
}
```

**Error Codes**
- `DUPLICATE_DOI`: Paper with this DOI already exists
- `INVALID_FIELD`: Field doesn't exist
- `VALIDATION_ERROR`: Missing required fields

---

### GET /api/v1/papers/:id
Get single paper with all metadata.

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "...",
    "authors": [...],
    "abstract": "...",
    "methodology": "...",
    "datasets": [{"name": "ImageNet", "url": "..."}],
    "algorithms": ["CNN", "Backpropagation"],
    "metrics": { "accuracy": 0.95 },
    "results": { "top_1": 0.95, "top_5": 0.99 },
    "limitations": "...",
    "future_work": "...",
    "reading_status": "READ",
    "personal_notes": "...",
    "related_papers": [
      {
        "id": "uuid",
        "title": "...",
        "relationship": "cites"
      }
    ]
  }
}
```

---

### PATCH /api/v1/papers/:id
Update paper metadata.

**Request** (any subset)
```json
{
  "reading_status": "ANALYZED",
  "importance_score": 9,
  "personal_notes": "Updated notes...",
  "project_id": "uuid"
}
```

**Response** (200 OK) - Updated paper object

---

### DELETE /api/v1/papers/:id
Soft delete paper.

**Response** (204 No Content)

---

### POST /api/v1/papers/import/arxiv
Import papers from arXiv.

**Request**
```json
{
  "arxiv_ids": ["1706.03762", "1512.03385"],
  "project_id": "uuid"
}
```

**Response** (201 Created)
```json
{
  "status": "success",
  "data": {
    "imported": 2,
    "papers": [{ /* paper objects */ }],
    "failed": []
  }
}
```

---

### POST /api/v1/papers/import/crossref
Import papers from Crossref/DOI.

**Request**
```json
{
  "dois": ["10.1109/CVPR.2016.90", "10.5555/..."],
  "project_id": "uuid"
}
```

**Response** (201 Created) - Similar to arXiv import

---

## 🔍 Research Problems Endpoints

### GET /api/v1/problems
List research problems.

**Query Parameters**
```
?page=1&limit=20&project_id=uuid&status=OPEN&difficulty_level=ADVANCED
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Detection of unseen IoT cyberattacks",
      "description": "...",
      "research_question": "How can we detect attacks not in training data?",
      "status": "INVESTIGATING",
      "difficulty_level": "ADVANCED",
      "impact_score": 8,
      "novelty_score": 7,
      "field_id": "uuid",
      "current_solutions": [
        {
          "id": "uuid",
          "title": "N-BaIoT Dataset approach",
          "paper_id": "uuid"
        }
      ],
      "related_papers": [{ /* papers */ }],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45 }
}
```

---

### POST /api/v1/problems
Create a new research problem.

**Request**
```json
{
  "title": "Detection of zero-day IoT attacks",
  "description": "...",
  "research_question": "How to detect previously unseen IoT attacks?",
  "real_world_problem": "IoT devices being compromised by unknown attacks",
  "why_it_matters": "Security of connected devices is critical",
  "field_id": "uuid",
  "subfield_id": "uuid",
  "project_id": "uuid",
  "difficulty_level": "ADVANCED",
  "status": "DISCOVERED"
}
```

**Response** (201 Created)
```json
{
  "status": "success",
  "data": { /* Full problem object */ }
}
```

---

### GET /api/v1/problems/:id
Get single problem with all related entities.

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "...",
    "description": "...",
    "status": "INVESTIGATING",
    "current_solutions": [{ /* solutions */ }],
    "research_gaps": [{ /* gaps */ }],
    "hypotheses": [{ /* hypotheses */ }],
    "experiments": [{ /* experiments */ }],
    "related_papers": [{ /* papers */ }],
    "possible_approaches": [
      {
        "approach": "Machine learning anomaly detection",
        "description": "..."
      }
    ]
  }
}
```

---

### PATCH /api/v1/problems/:id
Update problem status and details.

**Request**
```json
{
  "status": "GAP_FOUND",
  "impact_score": 9,
  "known_limitations": "..."
}
```

**Response** (200 OK) - Updated problem object

---

## 🎯 Research Gaps Endpoints

### GET /api/v1/gaps
List research gaps.

**Query Parameters**
```
?page=1&limit=20&gap_status=STRONGLY_SUPPORTED&field_id=uuid
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Lack of zero-day attack detection in IoT",
      "gap_statement": "Current IoT datasets don't include zero-day attacks",
      "gap_status": "STRONGLY_SUPPORTED",
      "evidence": "Literature review shows...",
      "confidence_score": 8,
      "novelty_estimate": 7,
      "impact_estimate": 9,
      "supporting_papers": [
        { "paper_id": "uuid", "relevance": 0.9 }
      ],
      "contradicting_papers": [],
      "problem_id": "uuid",
      "field_id": "uuid"
    }
  ]
}
```

---

### POST /api/v1/gaps
Create a new research gap.

**Request**
```json
{
  "title": "No zero-day IoT attack detection",
  "gap_statement": "Existing datasets and methods don't address zero-day IoT attacks",
  "evidence": "Survey of 50+ papers shows no mention of zero-day detection",
  "problem_id": "uuid",
  "field_id": "uuid",
  "gap_status": "POTENTIAL",
  "confidence_score": 7
}
```

**Response** (201 Created)

---

### GET /api/v1/gaps/:id
Get gap with supporting evidence.

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "...",
    "gap_statement": "...",
    "gap_status": "STRONGLY_SUPPORTED",
    "evidence": "...",
    "supporting_papers": [{ /* papers with citation context */ }],
    "contradicting_papers": [{ /* papers */ }],
    "what_not_tested": "Zero-day attacks on modern protocols like Matter",
    "confidence_score": 8,
    "novelty_estimate": 8,
    "impact_estimate": 9,
    "potential_solutions": [
      {
        "approach": "Transfer learning from cybersecurity to IoT",
        "estimated_effort": "High"
      }
    ]
  }
}
```

---

### PATCH /api/v1/gaps/:id
Update gap status and confidence.

**Request**
```json
{
  "gap_status": "STRONGLY_SUPPORTED",
  "confidence_score": 9,
  "evidence": "Additional evidence from..."
}
```

**Response** (200 OK)

---

## 🧪 Experiments Endpoints

### GET /api/v1/experiments
List experiments with filtering.

**Query Parameters**
```
?page=1&limit=20&project_id=uuid&status=COMPLETED
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Baseline vs Proposed Method on N-BaIoT",
      "description": "...",
      "hypothesis_id": "uuid",
      "problem_id": "uuid",
      "experiment_status": "COMPLETED",
      "methodology": "...",
      "dataset_id": "uuid",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-01-15T00:00:00Z",
      "results": [
        {
          "method_variant": "baseline_a",
          "accuracy": 0.92,
          "precision": 0.91,
          "recall": 0.93,
          "f1_score": 0.92,
          "latency_ms": 50,
          "memory_mb": 256
        },
        {
          "method_variant": "proposed",
          "accuracy": 0.96,
          "precision": 0.95,
          "recall": 0.97,
          "f1_score": 0.96,
          "latency_ms": 45,
          "memory_mb": 280
        }
      ]
    }
  ]
}
```

---

### POST /api/v1/experiments
Create a new experiment.

**Request**
```json
{
  "title": "N-BaIoT Zero-Day Detection Experiment",
  "description": "Test proposed method against N-BaIoT dataset",
  "hypothesis_id": "uuid",
  "problem_id": "uuid",
  "project_id": "uuid",
  "dataset_id": "uuid",
  "methodology": "Comparative evaluation with multiple baselines",
  "baseline_method": "Isolation Forest",
  "proposed_method": "LSTM Autoencoder + Attention",
  "alternative_methods": ["K-Means", "LOF"],
  "code_repository": "https://github.com/...",
  "parameters": {
    "learning_rate": 0.001,
    "batch_size": 32,
    "epochs": 100
  }
}
```

**Response** (201 Created)

---

### GET /api/v1/experiments/:id
Get single experiment with all results.

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "...",
    "methodology": "...",
    "start_date": "...",
    "end_date": "...",
    "environment": {
      "python_version": "3.10",
      "pytorch_version": "2.0",
      "gpu": "NVIDIA A100"
    },
    "results": [
      {
        "method_variant": "baseline_a",
        "accuracy": 0.92,
        "precision": 0.91,
        "recall": 0.93,
        "f1_score": 0.92,
        "custom_metrics": {
          "auroc": 0.94,
          "auprc": 0.89
        },
        "observations": "Baseline performs well but...",
        "reproducibility_status": "REPRODUCIBLE"
      }
    ],
    "conclusion": "Proposed method outperforms baselines by 4%",
    "related_hypothesis": { /* hypothesis object */ }
  }
}
```

---

### POST /api/v1/experiments/:id/results
Add experiment results.

**Request**
```json
{
  "method_variant": "proposed",
  "accuracy": 0.96,
  "precision": 0.95,
  "recall": 0.97,
  "f1_score": 0.96,
  "auc": 0.98,
  "latency_ms": 45,
  "memory_mb": 280,
  "cpu_percent": 60,
  "gpu_percent": 85,
  "observations": "Method converges faster and achieves better accuracy",
  "conclusion": "Proposed approach is superior on N-BaIoT",
  "reproducibility_status": "REPRODUCIBLE",
  "custom_metrics": {
    "auroc": 0.98,
    "auprc": 0.96
  }
}
```

**Response** (201 Created)

---

### PATCH /api/v1/experiments/:id
Update experiment status.

**Request**
```json
{
  "experiment_status": "COMPLETED",
  "end_date": "2024-01-15T00:00:00Z"
}
```

**Response** (200 OK)

---

## 🔗 Search Endpoints

### GET /api/v1/search
Global full-text search across all entities.

**Query Parameters**
```
?q=zero-day+IoT+attack&entity_types=papers,problems,gaps&limit=50
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "papers": [
      {
        "id": "uuid",
        "title": "...",
        "match_score": 0.95,
        "highlight": "...<mark>zero-day</mark> <mark>IoT</mark> <mark>attack</mark>..."
      }
    ],
    "problems": [
      {
        "id": "uuid",
        "title": "Detection of zero-day IoT cyberattacks",
        "match_score": 0.90
      }
    ],
    "gaps": [
      {
        "id": "uuid",
        "title": "No zero-day IoT attack detection",
        "match_score": 0.88
      }
    ]
  }
}
```

---

### GET /api/v1/search/papers
Search papers specifically.

**Query Parameters**
```
?q=attention+mechanism&field_id=uuid&year_from=2015&year_to=2024
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Attention Is All You Need",
      "authors": [...],
      "publication_year": 2017,
      "match_score": 0.99
    }
  ],
  "pagination": { ... }
}
```

---

## 🤖 AI Assistant Endpoints

### POST /api/v1/ai/explain-paper
Get AI explanation of a paper.

**Request**
```json
{
  "paper_id": "uuid",
  "aspect": "methodology"  // "summary", "methodology", "limitations", "datasets"
}
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "explanation": "The paper proposes a transformer architecture based on self-attention mechanisms...",
    "key_points": [
      "Parallel processing of sequences",
      "Multi-head attention for capturing different relationships"
    ],
    "complexity": "Intermediate",
    "references": [{ "paper_id": "uuid", "relevance": "foundational" }]
  }
}
```

---

### POST /api/v1/ai/identify-gaps
Get AI-identified research gaps for a problem.

**Request**
```json
{
  "problem_id": "uuid",
  "paper_ids": ["uuid1", "uuid2"]  // Optional: specific papers to analyze
}
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "identified_gaps": [
      {
        "gap": "No evaluation on zero-day attacks",
        "confidence": 0.92,
        "evidence": "Reference to papers that...",
        "status": "NEEDS_VERIFICATION",
        "supporting_papers": ["uuid1", "uuid2"]
      }
    ]
  }
}
```

---

### POST /api/v1/ai/compare-papers
Compare multiple papers.

**Request**
```json
{
  "paper_ids": ["uuid1", "uuid2", "uuid3"],
  "comparison_aspects": ["methodology", "datasets", "results"]
}
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "comparison_matrix": {
      "papers": [
        { "id": "uuid1", "title": "..." },
        { "id": "uuid2", "title": "..." }
      ],
      "aspects": {
        "methodology": [
          ["Approach 1", "Approach 2", "Approach 3"]
        ],
        "datasets": [
          ["ImageNet", "CIFAR-100", "Custom Dataset"]
        ],
        "results": [
          ["92%", "95%", "97%"]
        ]
      }
    }
  }
}
```

---

### POST /api/v1/ai/generate-hypothesis
Generate research hypotheses.

**Request**
```json
{
  "problem_id": "uuid",
  "based_on": ["paper_id1", "paper_id2"],
  "novelty_level": "high"  // "low", "medium", "high"
}
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "hypotheses": [
      {
        "hypothesis": "Transfer learning from general cybersecurity can improve IoT attack detection",
        "rationale": "Both domains share similar anomaly detection principles...",
        "testability": "High",
        "estimated_novelty": 0.75
      }
    ]
  }
}
```

---

## 🐛 Error Codes

### Authentication Errors
- `401_UNAUTHORIZED`: Missing or invalid token
- `403_FORBIDDEN`: Insufficient permissions
- `USER_NOT_FOUND`: User doesn't exist
- `INVALID_CREDENTIALS`: Wrong email/password

### Validation Errors
- `400_BAD_REQUEST`: Invalid request format
- `VALIDATION_ERROR`: Field validation failed
- `DUPLICATE_ENTRY`: Unique constraint violated
- `INVALID_FIELD_ID`: Referenced field doesn't exist

### Resource Errors
- `404_NOT_FOUND`: Resource doesn't exist
- `410_GONE`: Resource was deleted

### Server Errors
- `500_INTERNAL_ERROR`: Unexpected error
- `503_SERVICE_UNAVAILABLE`: Database connection failed

---

## 📊 Pagination

All list endpoints support pagination:

```
GET /api/v1/papers?page=2&limit=50&sort=-created_at
```

**Response includes:**
```json
{
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 2500,
    "total_pages": 50,
    "has_next": true,
    "has_prev": true
  }
}
```

---

## 🔐 Rate Limiting

- **Authenticated**: 50 requests/minute per user
- **Anonymous**: 10 requests/minute per IP

**Headers in response:**
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705315800
```

---

**Next**: Create the development plan and project setup instructions.
