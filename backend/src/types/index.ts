import { Request } from 'express';

export type UserRole = 'ADMIN' | 'RESEARCHER' | 'VIEWER';

export type ReadingStatus = 'UNREAD' | 'READING' | 'READ' | 'ANALYZED' | 'REPRODUCED' | 'CRITIQUED';

export type ProblemStatus = 
  | 'DISCOVERED' 
  | 'INVESTIGATING' 
  | 'GAP_FOUND' 
  | 'HYPOTHESIS' 
  | 'EXPERIMENTING' 
  | 'VALIDATED' 
  | 'REJECTED' 
  | 'SOLVED' 
  | 'OPEN';

export type GapStatus = 
  | 'POTENTIAL' 
  | 'NEEDS_VERIFICATION' 
  | 'LIKELY_EXPLORED' 
  | 'STRONGLY_SUPPORTED';

export type HypothesisStatus = 'PROPOSED' | 'TESTING' | 'SUPPORTED' | 'REJECTED' | 'INCONCLUSIVE';

export type ExperimentStatus = 'DESIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'ON_HOLD';

export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type OutputType = 'paper' | 'preprint' | 'patent' | 'prototype' | 'dataset' | 'algorithm';

export type OutputStatus = 'DRAFT' | 'IN_PROGRESS' | 'SUBMITTED' | 'PUBLISHED' | 'REJECTED';

export type NoteType = 'observation' | 'hypothesis' | 'decision' | 'todo' | 'general';

export type CitationType = 'extends' | 'refutes' | 'supports' | 'uses_method' | 'uses_data';

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  code: string;
  message?: string;
  data?: T;
  details?: any;
  meta: {
    timestamp: string;
    version: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T = any> {
  status: 'success';
  code: string;
  data: T[];
  pagination: PaginationMeta;
  meta: {
    timestamp: string;
    version: string;
  };
}

export function createSuccessResponse<T>(data: T, message?: string, code = 'OK'): ApiResponse<T> {
  return {
    status: 'success',
    code,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    status: 'success',
    code: 'OK',
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}

export function createErrorResponse(code: string, message: string, details?: any): ApiResponse<null> {
  return {
    status: 'error',
    code,
    message,
    details,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0',
    },
  };
}
