import apiClient from '../../../shared/services/apiClient';
import type { User, UserRole, UsersResponse, UserFilters } from '../types/user';

export interface AdminUserPayload {
  fullName?: string;
  email?: string;
  password?: string;
  roleCodes?: UserRole[];
  status?: 'ACTIVE' | 'INACTIVE';
  creditsBalance?: number;
}

export const userApi = {
  getUsers: async (filters: UserFilters): Promise<UsersResponse> => {
    const response: any = await apiClient.get('/admin/users', { params: filters });
    const payload = response.data;
    return {
      users: payload.data || [],
      pagination: {
        total: payload.total || 0,
        page: payload.page || 1,
        limit: payload.limit || 10,
        totalPages: payload.totalPages || 0,
      },
    };
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (data: AdminUserPayload): Promise<User> => {
    const response = await apiClient.post('/admin/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: AdminUserPayload): Promise<User> => {
    const response = await apiClient.patch(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },
};
