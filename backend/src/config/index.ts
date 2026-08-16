import dotenv from 'dotenv';
dotenv.config();

export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'research_os',
    user: process.env.DB_USER || 'research_user',
    password: process.env.DB_PASSWORD || 'secure_password_change_me',
    ssl: process.env.DB_SSL === 'true',
  },
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'research_os_jwt_super_secret_key_change_in_production_32chars',
    expiry: process.env.JWT_EXPIRY || '24h',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  apis: {
    arxiv: process.env.ARXIV_API_URL || 'https://export.arxiv.org/api/query',
    crossref: process.env.CROSSREF_API_URL || 'https://api.crossref.org',
    semanticScholar: process.env.SEMANTIC_SCHOLAR_API_URL || 'https://api.semanticscholar.org/graph/v1',
    openAlex: process.env.OPENALEX_API_URL || 'https://api.openalex.org',
    orcid: process.env.ORCID_API_URL || 'https://pub.orcid.org/v3.0',
  },
  ai: {
    anthropicKey: process.env.ANTHROPIC_API_KEY || '',
    geminiKey: process.env.GEMINI_API_KEY || '',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};
