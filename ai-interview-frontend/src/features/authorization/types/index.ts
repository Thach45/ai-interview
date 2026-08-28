export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Role {
  id: string;
  code: string;
  displayName: string;
  description?: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  method: HttpMethod;
  path: string;
  displayName: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreateRolePayload {
  code: string;
  displayName: string;
  description?: string;
  isSystem?: boolean;
  isActive?: boolean;
}

export interface UpdateRolePayload {
  displayName?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreatePermissionPayload {
  method: HttpMethod;
  path: string;
  displayName: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdatePermissionPayload {
  method?: HttpMethod;
  path?: string;
  displayName?: string;
  description?: string;
  isActive?: boolean;
}

export interface SyncResult {
  discovered: number;
  created: number;
  skipped: number;
  grantedToAdmin: number;
}
