export interface ApiResponse<T> {
  status?: string;
  code?: string;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  status?: string;
  code?: string;
  data: T[];
  pagination?: PaginationMeta;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface LoginResponse {
  token: string;
  user: import('./index').User;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: string;
  reading_status?: string;
  gap_status?: string;
  field_id?: string;
  difficulty?: string;
  domain?: string;
  category?: string;
  note_type?: string;
  [key: string]: any;
}
