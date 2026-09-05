import apiClient from '../../../shared/services/apiClient';
import type {
  CreatePermissionPayload,
  CreateRolePayload,
  Paginated,
  Permission,
  Role,
  SyncResult,
  UpdatePermissionPayload,
  UpdateRolePayload,
} from '../types';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authorizationApi = {
  // Roles
  getRoles: async (params: { page?: number; limit?: number; isActive?: boolean }) => {
    const response = await apiClient.get<never, ApiEnvelope<Paginated<Role>>>(
      '/admin/authorization/roles',
      { params },
    );
    return response.data;
  },

  createRole: async (payload: CreateRolePayload) => {
    const response = await apiClient.post<never, ApiEnvelope<Role>>(
      '/admin/authorization/roles',
      payload,
    );
    return response.data;
  },

  updateRole: async (id: string, payload: UpdateRolePayload) => {
    const response = await apiClient.patch<never, ApiEnvelope<Role>>(
      `/admin/authorization/roles/${id}`,
      payload,
    );
    return response.data;
  },

  deleteRole: async (id: string) => {
    await apiClient.delete(`/admin/authorization/roles/${id}`);
  },

  // Permissions
  getPermissions: async (params: { page?: number; limit?: number; isActive?: boolean }) => {
    const response = await apiClient.get<never, ApiEnvelope<Paginated<Permission>>>(
      '/admin/authorization/permissions',
      { params },
    );
    return response.data;
  },

  createPermission: async (payload: CreatePermissionPayload) => {
    const response = await apiClient.post<never, ApiEnvelope<Permission>>(
      '/admin/authorization/permissions',
      payload,
    );
    return response.data;
  },

  updatePermission: async (id: string, payload: UpdatePermissionPayload) => {
    const response = await apiClient.patch<never, ApiEnvelope<Permission>>(
      `/admin/authorization/permissions/${id}`,
      payload,
    );
    return response.data;
  },

  deletePermission: async (id: string) => {
    await apiClient.delete(`/admin/authorization/permissions/${id}`);
  },

  syncPermissions: async () => {
    const response = await apiClient.post<never, ApiEnvelope<SyncResult>>(
      '/admin/authorization/permissions/sync',
    );
    return response.data;
  },

  // Role <-> Permission
  getPermissionsForRole: async (roleId: string) => {
    const response = await apiClient.get<never, ApiEnvelope<Permission[]>>(
      `/admin/authorization/roles/${roleId}/permissions`,
    );
    return response.data;
  },

  replaceRolePermissions: async (roleId: string, permissionIds: string[]) => {
    const response = await apiClient.patch<never, ApiEnvelope<Permission[]>>(
      `/admin/authorization/roles/${roleId}/permissions`,
      { permissionIds },
    );
    return response.data;
  },

  assignPermission: async (roleId: string, permissionId: string) => {
    await apiClient.post(`/admin/authorization/roles/${roleId}/permissions/${permissionId}`);
  },

  unassignPermission: async (roleId: string, permissionId: string) => {
    await apiClient.delete(`/admin/authorization/roles/${roleId}/permissions/${permissionId}`);
  },
};
